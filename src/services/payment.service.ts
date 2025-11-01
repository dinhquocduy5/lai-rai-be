import { pool } from '@/db/pool';
import { paymentRepo } from '@/repositories/payment.repo';
import { orderRepo } from '@/repositories/order.repo';
import { tableRepo } from '@/repositories/table.repo';
import type { CreatePaymentDTO } from '@/models/payments';
import { BadRequestError, ConflictError } from '@/utils/errors';

export const paymentService = {
  async getAllPayments() {
    const payments = await paymentRepo.findAll();
    return payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
    }));
  },

  async getPaymentById(id: number) {
    const payment = await paymentRepo.findByIdOrThrow(id);
    return {
      ...payment,
      amount: Number(payment.amount),
    };
  },

  async getPaymentByOrderId(orderId: number) {
    await orderRepo.findByIdOrThrow(orderId); // Validate order exists
    const payment = await paymentRepo.findByOrderId(orderId);
    
    if (!payment) {
      return null;
    }

    return {
      ...payment,
      amount: Number(payment.amount),
    };
  },

  async processPayment(data: CreatePaymentDTO) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get order
      const orderResult = await client.query(
        'SELECT * FROM orders WHERE id = $1',
        [data.order_id],
      );
      
      if (orderResult.rowCount === 0) {
        throw new BadRequestError('Order not found');
      }

      const order = orderResult.rows[0];

      // Check if order is pending
      if (order.status !== 'pending') {
        throw new BadRequestError('Can only pay for pending orders');
      }

      // Check if payment already exists
      const existingPayment = await client.query(
        'SELECT id FROM payments WHERE order_id = $1',
        [data.order_id],
      );
      
      if (existingPayment.rowCount && existingPayment.rowCount > 0) {
        throw new ConflictError('Order has already been paid');
      }

      // Calculate order total
      const totalResult = await client.query(
        `SELECT COALESCE(SUM(quantity * price_at_order_time), 0)::text AS total
         FROM order_items WHERE order_id = $1`,
        [data.order_id],
      );
      const orderTotal = Number(totalResult.rows[0].total);

      // Validate payment amount matches order total
      if (Math.abs(data.amount - orderTotal) > 0.01) {
        throw new BadRequestError(
          `Payment amount (${data.amount}) does not match order total (${orderTotal})`,
        );
      }

      // Create payment
      const paymentResult = await client.query(
        `INSERT INTO payments (order_id, amount, payment_method)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [data.order_id, data.amount, data.payment_method || 'cash'],
      );
      const payment = paymentResult.rows[0];

      // Complete order
      await client.query(
        `UPDATE orders 
         SET status = 'completed', check_out = NOW() 
         WHERE id = $1`,
        [data.order_id],
      );

      // Set table back to available
      await client.query(
        `UPDATE tables 
         SET status = 'available' 
         WHERE id = $1`,
        [order.table_id],
      );

      await client.query('COMMIT');

      // Get order items for bill
      const itemsResult = await client.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [data.order_id],
      );

      return {
        payment: {
          ...payment,
          amount: Number(payment.amount),
        },
        order: {
          ...order,
          status: 'completed',
          check_out: new Date().toISOString(),
        },
        items: itemsResult.rows.map((item) => ({
          ...item,
          price_at_order_time: Number(item.price_at_order_time),
        })),
        total: orderTotal,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getRevenue(startDate?: string, endDate?: string) {
    return paymentRepo.getRevenue(startDate, endDate);
  },
};
