import { pool, db } from '@/db/pool';
import { OrderItemRow } from '@/models/order-items';
import { OrderRow } from '@/models/orders';
import { NotFoundError, BadRequestError } from '@/utils/errors';

export interface CreateOrderWithItemsInput {
  table_id: number;
  items: { menu_item_id: number; quantity: number; note?: string | null }[];
}

export interface UpdateOrderItemsInput {
  items: { menu_item_id: number; quantity: number; note?: string | null }[];
}

export const orderRepo = {
  async findAll(): Promise<OrderRow[]> {
    const result = await db.query<OrderRow>('SELECT * FROM orders ORDER BY check_in DESC');
    return result.rows;
  },

  async findById(id: number): Promise<OrderRow | null> {
    const result = await db.query<OrderRow>('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findByIdOrThrow(id: number): Promise<OrderRow> {
    const order = await this.findById(id);
    if (!order) throw new NotFoundError('Order');
    return order;
  },

  async findByTableId(tableId: number): Promise<OrderRow[]> {
    const result = await db.query<OrderRow>(
      'SELECT * FROM orders WHERE table_id = $1 ORDER BY check_in DESC',
      [tableId],
    );
    return result.rows;
  },

  async findActiveByTableId(tableId: number): Promise<OrderRow | null> {
    const result = await db.query<OrderRow>(
      `SELECT * FROM orders 
       WHERE table_id = $1 AND status = 'pending' AND check_out IS NULL
       ORDER BY check_in DESC LIMIT 1`,
      [tableId],
    );
    return result.rows[0] || null;
  },

  async getOrderItems(orderId: number): Promise<OrderItemRow[]> {
    const result = await db.query<OrderItemRow>(
      `SELECT oi.*, mi.name, mi.type 
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = $1 
       ORDER BY oi.created_at`,
      [orderId],
    );
    return result.rows;
  },

  async getOrderTotal(orderId: number): Promise<number> {
    const result = await db.query<{ total: string }>(
      `SELECT COALESCE(SUM(quantity * price_at_order_time), 0)::text AS total
       FROM order_items WHERE order_id = $1`,
      [orderId],
    );
    return Number(result.rows[0].total);
  },

  async createWithItemsTx(input: CreateOrderWithItemsInput) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if table exists and is available
      const tableCheck = await client.query(
        'SELECT status FROM tables WHERE id = $1',
        [input.table_id],
      );
      if (tableCheck.rowCount === 0) {
        throw new NotFoundError('Table');
      }

      // Create order
      const o = await client.query<OrderRow>(
        `INSERT INTO orders (table_id, status)
         VALUES ($1, 'pending')
         RETURNING id, table_id, check_in, check_out, status`,
        [input.table_id],
      );
      const order = o.rows[0];

      // Add items
      const items: OrderItemRow[] = [];
      for (const it of input.items) {
        const r = await client.query<OrderItemRow>(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order_time, note)
           SELECT $1, m.id, $2, m.price, $3
           FROM menu_items m WHERE m.id = $4
           RETURNING id, order_id, menu_item_id, quantity, price_at_order_time, note, created_at`,
          [order.id, it.quantity, it.note ?? null, it.menu_item_id],
        );
        if (r.rowCount === 0) throw new NotFoundError(`Menu item with id ${it.menu_item_id}`);
        items.push(r.rows[0]);
      }

      // Update table status
      await client.query(`UPDATE tables SET status = 'occupied' WHERE id = $1`, [input.table_id]);

      // Calculate total
      const totalRes = await client.query<{ total: string }>(
        `SELECT COALESCE(SUM(quantity * price_at_order_time), 0)::text AS total
         FROM order_items WHERE order_id = $1`,
        [order.id],
      );
      const total = Number(totalRes.rows[0].total);

      await client.query('COMMIT');

      return {
        order,
        items: items.map((x) => ({ ...x, price_at_order_time: Number(x.price_at_order_time) })),
        total,
      };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  async updateOrderItemsTx(orderId: number, input: UpdateOrderItemsInput) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if order exists and is pending
      const orderCheck = await client.query<OrderRow>(
        'SELECT * FROM orders WHERE id = $1',
        [orderId],
      );
      if (orderCheck.rowCount === 0) {
        throw new NotFoundError('Order');
      }
      const order = orderCheck.rows[0];
      if (order.status !== 'pending') {
        throw new BadRequestError('Cannot update items for completed or cancelled order');
      }

      // Delete existing items
      await client.query('DELETE FROM order_items WHERE order_id = $1', [orderId]);

      // Add new items
      const items: OrderItemRow[] = [];
      for (const it of input.items) {
        const r = await client.query<OrderItemRow>(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order_time, note)
           SELECT $1, m.id, $2, m.price, $3
           FROM menu_items m WHERE m.id = $4
           RETURNING id, order_id, menu_item_id, quantity, price_at_order_time, note, created_at`,
          [orderId, it.quantity, it.note ?? null, it.menu_item_id],
        );
        if (r.rowCount === 0) throw new NotFoundError(`Menu item with id ${it.menu_item_id}`);
        items.push(r.rows[0]);
      }

      // Calculate new total
      const totalRes = await client.query<{ total: string }>(
        `SELECT COALESCE(SUM(quantity * price_at_order_time), 0)::text AS total
         FROM order_items WHERE order_id = $1`,
        [orderId],
      );
      const total = Number(totalRes.rows[0].total);

      await client.query('COMMIT');

      return {
        order,
        items: items.map((x) => ({ ...x, price_at_order_time: Number(x.price_at_order_time) })),
        total,
      };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  async updateStatus(orderId: number, status: 'pending' | 'completed' | 'cancelled'): Promise<OrderRow> {
    const result = await db.query<OrderRow>(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, orderId],
    );
    if (result.rowCount === 0) throw new NotFoundError('Order');
    return result.rows[0];
  },

  async completeOrder(orderId: number): Promise<OrderRow> {
    const result = await db.query<OrderRow>(
      `UPDATE orders 
       SET status = 'completed', check_out = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [orderId],
    );
    if (result.rowCount === 0) throw new NotFoundError('Order');
    return result.rows[0];
  },
};
