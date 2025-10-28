import type { PaymentMethod } from './common';

export interface PaymentRow {
  id: number; // SERIAL
  order_id: number; // FK orders.id
  amount: string; // NUMERIC(10,2) -> string
  paid_at: string; // TIMESTAMP
  payment_method: PaymentMethod; // 'cash'
}

export type Payment = Omit<PaymentRow, 'amount'> & { amount: number };

export interface CreatePaymentDTO {
  order_id: number;
  amount: number;
  payment_method?: PaymentMethod; // default 'cash' ở DB
}
