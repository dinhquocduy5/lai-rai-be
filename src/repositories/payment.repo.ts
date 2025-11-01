import { db } from '@/db/pool';
import type { PaymentRow, CreatePaymentDTO } from '@/models/payments';
import { NotFoundError } from '@/utils/errors';

export const paymentRepo = {
  async findAll(): Promise<PaymentRow[]> {
    const result = await db.query<PaymentRow>('SELECT * FROM payments ORDER BY paid_at DESC');
    return result.rows;
  },

  async findById(id: number): Promise<PaymentRow | null> {
    const result = await db.query<PaymentRow>('SELECT * FROM payments WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findByOrderId(orderId: number): Promise<PaymentRow | null> {
    const result = await db.query<PaymentRow>(
      'SELECT * FROM payments WHERE order_id = $1',
      [orderId],
    );
    return result.rows[0] || null;
  },

  async create(data: CreatePaymentDTO): Promise<PaymentRow> {
    const result = await db.query<PaymentRow>(
      `INSERT INTO payments (order_id, amount, payment_method)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.order_id, data.amount, data.payment_method || 'cash'],
    );
    return result.rows[0];
  },

  async findByIdOrThrow(id: number): Promise<PaymentRow> {
    const payment = await this.findById(id);
    if (!payment) throw new NotFoundError('Payment');
    return payment;
  },

  // Revenue report by date range
  async getRevenue(startDate?: string, endDate?: string): Promise<{ 
    total_revenue: number; 
    total_orders: number 
  }> {
    let query = 'SELECT COALESCE(SUM(amount), 0) as total_revenue, COUNT(*) as total_orders FROM payments';
    const values: any[] = [];
    
    if (startDate && endDate) {
      query += ' WHERE paid_at >= $1 AND paid_at <= $2';
      values.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE paid_at >= $1';
      values.push(startDate);
    } else if (endDate) {
      query += ' WHERE paid_at <= $1';
      values.push(endDate);
    }

    const result = await db.query<{ total_revenue: string; total_orders: string }>(query, values);
    return {
      total_revenue: Number(result.rows[0].total_revenue),
      total_orders: Number(result.rows[0].total_orders),
    };
  },
};
