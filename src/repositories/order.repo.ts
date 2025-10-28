// src/repositories/order.repo.ts
import { pool } from '@/db/pool';
import { OrderItemRow } from '@/models/order-items';
import { OrderRow } from '@/models/orders';

export interface CreateOrderWithItemsInput {
  table_id: number;
  items: { menu_item_id: number; quantity: number; note?: string | null }[];
}

export const orderRepo = {
  async createWithItemsTx(input: CreateOrderWithItemsInput) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const o = await client.query<OrderRow>(
        `INSERT INTO orders (table_id, status)
         VALUES ($1, 'pending')
         RETURNING id, table_id, check_in, check_out, status`,
        [input.table_id],
      );
      const order = o.rows[0];

      const items: OrderItemRow[] = [];
      for (const it of input.items) {
        const r = await client.query<OrderItemRow>(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order_time, note)
           SELECT $1, m.id, $2, m.price, $3
           FROM menu_items m WHERE m.id = $4
           RETURNING id, order_id, menu_item_id, quantity, price_at_order_time, note, created_at`,
          [order.id, it.quantity, it.note ?? null, it.menu_item_id],
        );
        if (r.rowCount === 0) throw new Error(`Menu item not found: ${it.menu_item_id}`);
        items.push(r.rows[0]);
      }

      await client.query(`UPDATE tables SET status='occupied' WHERE id=$1`, [input.table_id]);

      const totalRes = await client.query<{ total: string }>(
        `SELECT COALESCE(SUM(quantity*price_at_order_time),0)::text AS total
         FROM order_items WHERE order_id=$1`,
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
};
