import { logger } from '@/utils/logger';

export const workersLoader = async () => {
  await import('@/jobs');
  logger.info('Root workers loaded');
  await import('@bes/jobs');
  logger.info('Bes workers loaded');
};
