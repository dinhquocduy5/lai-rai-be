import type { Request, Response } from 'express';
import { tableService } from '@/services/table.service';
import { asyncHandler } from '@/middlewares/async-handler';

export const tableController = {
  getAll: asyncHandler(async (_req: Request, res: Response) => {
    const tables = await tableService.getAllTables();
    res.json({ success: true, data: tables });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const table = await tableService.getTableById(id);
    res.json({ success: true, data: table });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const table = await tableService.createTable(req.body);
    res.status(201).json({ success: true, data: table });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const table = await tableService.updateTable(id, req.body);
    res.json({ success: true, data: table });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await tableService.deleteTable(id);
    res.json({ success: true, message: 'Table deleted successfully' });
  }),

  setAvailable: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const table = await tableService.setTableAvailable(id);
    res.json({ success: true, data: table });
  }),

  setOccupied: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const table = await tableService.setTableOccupied(id);
    res.json({ success: true, data: table });
  }),
};
