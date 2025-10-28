import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { routes } from '@/routes';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // default route
  app.get('/health', (_req, res) => res.json({ ok: true }));

  // mount all routes
  app.use('/api', routes());

  return app;
}
