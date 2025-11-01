import { orderRepo } from '@/repositories/order.repo';
import { tableRepo } from '@/repositories/table.repo';
import type { CreateOrderWithItemsInput, UpdateOrderItemsInput } from '@/repositories/order.repo';
import { BadRequestError, ConflictError } from '@/utils/errors';

export const orderService = {
  async getAllOrders() {
    const orders = await orderRepo.findAll();
    
    // Fetch items and total for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const items = await orderRepo.getOrderItems(order.id);
        const total = await orderRepo.getOrderTotal(order.id);
        
        return {
          ...order,
          items: items.map((item) => ({
            ...item,
            price_at_order_time: Number(item.price_at_order_time),
          })),
          total_amount: total,
        };
      })
    );
    
    return ordersWithDetails;
  },

  async getOrderById(id: number) {
    const order = await orderRepo.findByIdOrThrow(id);
    const items = await orderRepo.getOrderItems(id);
    const total = await orderRepo.getOrderTotal(id);

    return {
      order,
      items: items.map((item) => ({
        ...item,
        price_at_order_time: Number(item.price_at_order_time),
      })),
      total,
    };
  },

  async getOrdersByTableId(tableId: number) {
    await tableRepo.findByIdOrThrow(tableId); // Validate table exists
    return orderRepo.findByTableId(tableId);
  },

  async getActiveOrderByTableId(tableId: number) {
    await tableRepo.findByIdOrThrow(tableId); // Validate table exists
    const order = await orderRepo.findActiveByTableId(tableId);
    
    if (!order) {
      return null;
    }

    const items = await orderRepo.getOrderItems(order.id);
    const total = await orderRepo.getOrderTotal(order.id);

    return {
      order,
      items: items.map((item) => ({
        ...item,
        price_at_order_time: Number(item.price_at_order_time),
      })),
      total,
    };
  },

  async createOrder(data: CreateOrderWithItemsInput) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestError('Order must have at least one item');
    }

    // Validate items
    for (const item of data.items) {
      if (item.quantity <= 0) {
        throw new BadRequestError('Item quantity must be positive');
      }
    }

    // Check if table already has active order
    const activeOrder = await orderRepo.findActiveByTableId(data.table_id);
    if (activeOrder) {
      throw new ConflictError('Table already has an active order. Please complete or cancel it first.');
    }

    return orderRepo.createWithItemsTx(data);
  },

  async updateOrderItems(orderId: number, data: UpdateOrderItemsInput) {
    if (!data.items || data.items.length === 0) {
      throw new BadRequestError('Order must have at least one item');
    }

    // Validate items
    for (const item of data.items) {
      if (item.quantity <= 0) {
        throw new BadRequestError('Item quantity must be positive');
      }
    }

    return orderRepo.updateOrderItemsTx(orderId, data);
  },

  async cancelOrder(orderId: number) {
    const order = await orderRepo.findByIdOrThrow(orderId);
    
    if (order.status !== 'pending') {
      throw new BadRequestError('Can only cancel pending orders');
    }

    // Update order status
    const updatedOrder = await orderRepo.updateStatus(orderId, 'cancelled');
    
    // Set table back to available
    await tableRepo.updateStatus(order.table_id, 'available');

    return updatedOrder;
  },
};
