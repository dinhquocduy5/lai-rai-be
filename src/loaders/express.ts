import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { routes } from '@/routes';
import { errorHandler, notFoundHandler } from '@/middlewares/error-handler';
import { requestLogger } from '@/middlewares/request-logger';

export function createApp() {
  const app = express();

  // Security & parsing
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use(requestLogger);

  // Root health check
  app.get('/health', (_req, res) => res.json({ success: true, message: 'Server is running' }));

  // Mount all API routes
  app.use('/api', routes());

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
