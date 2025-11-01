export interface OrderItemRow {
  id: number; // SERIAL
  order_id: number; // FK orders.id
  menu_item_id: number; // FK menu_items.id
  quantity: number; // INTEGER
  price_at_order_time: string; // NUMERIC(10,2) -> string
  note: string | null; // TEXT
  created_at: string; // TIMESTAMP
  name?: string; // From JOIN with menu_items
  type?: 'food' | 'drink'; // From JOIN with menu_items
}

export type OrderItem = Omit<OrderItemRow, 'price_at_order_time'> & { price_at_order_time: number };

export interface AddOrderItemDTO {
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price_at_order_time: number;
  note?: string | null;
}
export interface UpdateOrderItemDTO {
  quantity?: number;
  price_at_order_time?: number;
  note?: string | null;
}
