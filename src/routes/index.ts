import { Router } from 'express';
import { healthRoutes } from '@/routes/v1/health.route';

export function routes() {
  const router = Router();
  router.use('/v1/health', healthRoutes);
  return router;
}
