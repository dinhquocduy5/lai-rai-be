import { Router } from 'express';
import { healthRoutes } from '@/routes/v1/health.route';
import { tableRoutes } from '@/routes/v1/table.route';
import { menuItemRoutes } from '@/routes/v1/menu-item.route';
import { orderRoutes } from '@/routes/v1/order.route';
import { paymentRoutes } from '@/routes/v1/payment.route';

export function routes() {
  const router = Router();
  
  // Health check
  router.use('/v1/health', healthRoutes);
  
  // Resources
  router.use('/v1/tables', tableRoutes);
  router.use('/v1/menu-items', menuItemRoutes);
  router.use('/v1/orders', orderRoutes);
  router.use('/v1/payments', paymentRoutes);
  
  return router;
}
