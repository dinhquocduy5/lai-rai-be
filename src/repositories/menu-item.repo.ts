import { db } from '@/db/pool';
import type { MenuItemRow, CreateMenuItemDTO, UpdateMenuItemDTO } from '@/models/menu-items';
import { NotFoundError } from '@/utils/errors';

export const menuItemRepo = {
  async findAll(type?: 'food' | 'drink'): Promise<MenuItemRow[]> {
    if (type) {
      const result = await db.query<MenuItemRow>(
        'SELECT * FROM menu_items WHERE type = $1 ORDER BY category, id',
        [type],
      );
      return result.rows;
    }
    const result = await db.query<MenuItemRow>('SELECT * FROM menu_items ORDER BY category, id');
    return result.rows;
  },

  async findById(id: number): Promise<MenuItemRow | null> {
    const result = await db.query<MenuItemRow>('SELECT * FROM menu_items WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findByIdOrThrow(id: number): Promise<MenuItemRow> {
    const item = await this.findById(id);
    if (!item) throw new NotFoundError('Menu item');
    return item;
  },

  async create(data: CreateMenuItemDTO): Promise<MenuItemRow> {
    const result = await db.query<MenuItemRow>(
      `INSERT INTO menu_items (name, price, type, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.name, data.price, data.type, data.category || null],
    );
    return result.rows[0];
  },

  async update(id: number, data: UpdateMenuItemDTO): Promise<MenuItemRow> {
    const sets: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      sets.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.price !== undefined) {
      sets.push(`price = $${paramCount++}`);
      values.push(data.price);
    }
    if (data.type !== undefined) {
      sets.push(`type = $${paramCount++}`);
      values.push(data.type);
    }
    if (data.category !== undefined) {
      sets.push(`category = $${paramCount++}`);
      values.push(data.category);
    }

    if (sets.length === 0) {
      return this.findByIdOrThrow(id);
    }

    values.push(id);
    const result = await db.query<MenuItemRow>(
      `UPDATE menu_items SET ${sets.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values,
    );

    if (result.rowCount === 0) throw new NotFoundError('Menu item');
    return result.rows[0];
  },

  async delete(id: number): Promise<void> {
    const result = await db.query('DELETE FROM menu_items WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new NotFoundError('Menu item');
  },

  async findAllGroupedByCategory(): Promise<Record<string, MenuItemRow[]>> {
    const result = await db.query<MenuItemRow>(
      'SELECT * FROM menu_items ORDER BY category, id',
    );
    
    const grouped: Record<string, MenuItemRow[]> = {};
    for (const item of result.rows) {
      const category = item.category || 'Khác'; // Default category if null
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    }
    
    return grouped;
  },
};
