import * as express from 'express';
import expressLoader from './express';
import mongooseLoader from './mongoose';
import { logger } from '../utils/logger';
import subscribersLoader from './subscribers';

interface InitLoadersProps {
  expressApp: express.Application;
}

const initLoaders = async ({ expressApp }: InitLoadersProps) => {
  // Load express loader
  await expressLoader({ app: expressApp });
  logger.info('Express loaded');
  // Load mongoose loader
  await mongooseLoader();
  logger.info('MongoDB loaded');
  // Load subscribers
  await subscribersLoader();
  logger.info('Subscribers loaded');
};

export default initLoaders;
