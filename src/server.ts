import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { app } from './app';

app.listen(env.PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${env.PORT}`);
});
