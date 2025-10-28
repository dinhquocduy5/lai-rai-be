import { Router } from 'express';
import { db } from '@/db/pool';

export const healthRoutes = Router();

healthRoutes.get('/db', async (_req, res) => {
  try {
    const result = await db.query<{ now: string }>('SELECT NOW() AS now');
    res.json({ ok: true, time: result.rows[0].now });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});
