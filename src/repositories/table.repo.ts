import { db } from '@/db/pool';
import type { TableRow, CreateTableDTO, UpdateTableDTO } from '@/models/tables';
import { NotFoundError } from '@/utils/errors';

export const tableRepo = {
  async findAll(): Promise<TableRow[]> {
    const result = await db.query<TableRow>('SELECT * FROM tables ORDER BY id');
    return result.rows;
  },

  async findById(id: number): Promise<TableRow | null> {
    const result = await db.query<TableRow>('SELECT * FROM tables WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findByIdOrThrow(id: number): Promise<TableRow> {
    const table = await this.findById(id);
    if (!table) throw new NotFoundError('Table');
    return table;
  },

  async create(data: CreateTableDTO): Promise<TableRow> {
    const result = await db.query<TableRow>(
      `INSERT INTO tables (name, status)
       VALUES ($1, $2)
       RETURNING *`,
      [data.name, data.status || 'available'],
    );
    return result.rows[0];
  },

  async update(id: number, data: UpdateTableDTO): Promise<TableRow> {
    const sets: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      sets.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.status !== undefined) {
      sets.push(`status = $${paramCount++}`);
      values.push(data.status);
    }

    if (sets.length === 0) {
      return this.findByIdOrThrow(id);
    }

    values.push(id);
    const result = await db.query<TableRow>(
      `UPDATE tables SET ${sets.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values,
    );

    if (result.rowCount === 0) throw new NotFoundError('Table');
    return result.rows[0];
  },

  async delete(id: number): Promise<void> {
    const result = await db.query('DELETE FROM tables WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new NotFoundError('Table');
  },

  async updateStatus(id: number, status: 'available' | 'occupied'): Promise<TableRow> {
    const result = await db.query<TableRow>(
      'UPDATE tables SET status = $1 WHERE id = $2 RETURNING *',
      [status, id],
    );
    if (result.rowCount === 0) throw new NotFoundError('Table');
    return result.rows[0];
  },
};
