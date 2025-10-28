import type { MenuItemType } from './common';

export interface MenuItemRow {
  id: number; // SERIAL
  name: string; // VARCHAR(100)
  price: string; // NUMERIC(10,2) -> string từ pg
  type: MenuItemType; // food | drink
}

export type MenuItem = Omit<MenuItemRow, 'price'> & { price: number }; // nếu muốn domain là number

export interface CreateMenuItemDTO {
  name: string;
  price: number; // nhận number từ API → repo sẽ format/parse
  type: MenuItemType;
}
export interface UpdateMenuItemDTO {
  name?: string;
  price?: number;
  type?: MenuItemType;
}
