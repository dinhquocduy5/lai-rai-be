import { menuItemRepo } from '@/repositories/menu-item.repo';
import type { CreateMenuItemDTO, UpdateMenuItemDTO } from '@/models/menu-items';

export const menuItemService = {
  async getAllMenuItems(type?: 'food' | 'drink') {
    const items = await menuItemRepo.findAll(type);
    // Convert price string to number for client
    return items.map((item) => ({
      ...item,
      price: Number(item.price),
    }));
  },

  async getMenuItemById(id: number) {
    const item = await menuItemRepo.findByIdOrThrow(id);
    return {
      ...item,
      price: Number(item.price),
    };
  },

  async createMenuItem(data: CreateMenuItemDTO) {
    const item = await menuItemRepo.create(data);
    return {
      ...item,
      price: Number(item.price),
    };
  },

  async updateMenuItem(id: number, data: UpdateMenuItemDTO) {
    const item = await menuItemRepo.update(id, data);
    return {
      ...item,
      price: Number(item.price),
    };
  },

  async deleteMenuItem(id: number) {
    return menuItemRepo.delete(id);
  },

  async getMenuItemsGroupedByCategory() {
    const grouped = await menuItemRepo.findAllGroupedByCategory();
    // Convert price string to number for each item in each category
    const result: Record<string, any[]> = {};
    for (const [category, items] of Object.entries(grouped)) {
      result[category] = items.map((item) => ({
        ...item,
        price: Number(item.price),
      }));
    }
    return result;
  },
};
