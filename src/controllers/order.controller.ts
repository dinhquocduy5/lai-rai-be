import type { Request, Response } from 'express';
import { orderService } from '@/services/order.service';
import { asyncHandler } from '@/middlewares/async-handler';

export const orderController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, data: orders });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const order = await orderService.getOrderById(id);
    res.json({ success: true, data: order });
  }),

  getByTableId: asyncHandler(async (req: Request, res: Response) => {
    const tableId = Number(req.params.tableId);
    const orders = await orderService.getOrdersByTableId(tableId);
    res.json({ success: true, data: orders });
  }),

  getActiveByTableId: asyncHandler(async (req: Request, res: Response) => {
    const tableId = Number(req.params.tableId);
    const order = await orderService.getActiveOrderByTableId(tableId);
    res.json({ success: true, data: order });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const data = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data });
  }),

  updateItems: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = await orderService.updateOrderItems(id, req.body);
    res.json({ success: true, data });
  }),

  cancel: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const order = await orderService.cancelOrder(id);
    res.json({ success: true, data: order, message: 'Order cancelled successfully' });
  }),
};
