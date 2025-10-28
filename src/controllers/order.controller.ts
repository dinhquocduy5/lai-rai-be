import type { Request, Response } from 'express';
import { orderRepo } from '@/repositories/order.repo';

export const orderController = {
  async create(req: Request, res: Response) {
    const body = req.body as Parameters<typeof orderRepo.createWithItemsTx>[0]; // hoặc interface
    const data = await orderRepo.createWithItemsTx(body);
    res.status(201).json(data);
  },

  async update(req: Request, res: Response) {
    // const orderId = Number(req.params.id);
    // const body = req.body as Parameters<typeof orderRepo.updateOrder>[1];
    // const data = await orderRepo.updateOrder(orderId, body);
    // res.json(data);
  },
};
