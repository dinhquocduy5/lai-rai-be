import type { Request, Response } from 'express';
import { paymentService } from '@/services/payment.service';
import { asyncHandler } from '@/middlewares/async-handler';

export const paymentController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const payments = await paymentService.getAllPayments();
    res.json({ success: true, data: payments });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payment = await paymentService.getPaymentById(id);
    res.json({ success: true, data: payment });
  }),

  getByOrderId: asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.orderId);
    const payment = await paymentService.getPaymentByOrderId(orderId);
    res.json({ success: true, data: payment });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.processPayment(req.body);
    res.status(201).json({ 
      success: true, 
      data: result,
      message: 'Payment processed successfully' 
    });
  }),

  getRevenue: asyncHandler(async (req: Request, res: Response) => {
    const { start_date, end_date } = req.query;
    const revenue = await paymentService.getRevenue(
      start_date as string | undefined,
      end_date as string | undefined,
    );
    res.json({ success: true, data: revenue });
  }),
};
