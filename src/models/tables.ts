import type { TableStatus } from './common';

// Row đúng theo DB
export interface TableRow {
  id: number; // SERIAL
  name: string; // VARCHAR(50)
  status: TableStatus; // available | occupied
}

// Domain (nếu muốn tách, có thể giữ giống Row)
export type Table = TableRow;

// DTO
export interface CreateTableDTO {
  name: string;
  status?: TableStatus; // default 'available' ở DB
}
export interface UpdateTableDTO {
  name?: string;
  status?: TableStatus;
}
