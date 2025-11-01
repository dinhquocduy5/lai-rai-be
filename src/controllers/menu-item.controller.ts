import type { Request, Response } from 'express';
import { menuItemService } from '@/services/menu-item.service';
import { asyncHandler } from '@/middlewares/async-handler';

export const menuItemController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const type = req.query.type as 'food' | 'drink' | undefined;
    const items = await menuItemService.getAllMenuItems(type);
    res.json({ success: true, data: items });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await menuItemService.getMenuItemById(id);
    res.json({ success: true, data: item });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const item = await menuItemService.createMenuItem(req.body);
    res.status(201).json({ success: true, data: item });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await menuItemService.updateMenuItem(id, req.body);
    res.json({ success: true, data: item });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await menuItemService.deleteMenuItem(id);
    res.json({ success: true, message: 'Menu item deleted successfully' });
  }),

  getGroupedByCategory: asyncHandler(async (req: Request, res: Response) => {
    const grouped = await menuItemService.getMenuItemsGroupedByCategory();
    res.json({ success: true, data: grouped });
  }),
};
