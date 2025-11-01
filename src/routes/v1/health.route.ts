import { Router } from 'express';
import { db } from '@/db/pool';
import { asyncHandler } from '@/middlewares/async-handler';

export const healthRoutes = Router();

healthRoutes.get(
  '/db',
  asyncHandler(async (_req, res) => {
    const result = await db.query<{ now: string }>('SELECT NOW() AS now');
    res.json({ 
      success: true, 
      message: 'Database connected',
      time: result.rows[0].now 
    });
  }),
);

healthRoutes.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});
