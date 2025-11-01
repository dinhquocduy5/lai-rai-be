import 'module-alias/register';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { app } from './app';
import cors from 'cors';

app.listen(env.PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${env.PORT}`);
});

app.use(cors({
  origin: [
    'https://lai-rai-fe.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));