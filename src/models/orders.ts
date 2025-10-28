import type { OrderStatus } from './common';

export interface OrderRow {
  id: number; // SERIAL
  table_id: number; // FK tables.id
  check_in: string; // TIMESTAMP (ISO string)
  check_out: string | null; // TIMESTAMP nullable
  status: OrderStatus; // pending | completed | cancelled
}

export type Order = OrderRow;

export interface CreateOrderDTO {
  table_id: number;
  // check_in do DB default NOW()
  status?: OrderStatus; // default 'pending'
}
export interface UpdateOrderDTO {
  table_id?: number;
  check_out?: string | null;
  status?: OrderStatus;
}
