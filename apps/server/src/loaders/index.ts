import * as express from 'express';
import expressLoader from './express';
import mongooseLoader from './mongoose';
import { logger } from '../utils/logger';
import { redisLoader } from './redis';
import { workersLoader } from './workers';

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
  // Load redis loader
  await redisLoader();
  logger.info('Redis loaded');
  // Load jobs
  await workersLoader();
  logger.info('Workers loaded');
};

export default initLoaders;
