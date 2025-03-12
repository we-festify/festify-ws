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
  let startTime = Date.now();
  let diff = Date.now() - startTime;

  // Load mongoose loader
  startTime = Date.now();
  await mongooseLoader();
  diff = Date.now() - startTime;
  logger.info(`MongoDB loaded (${diff}ms)`);

  // Load redis loader
  startTime = Date.now();
  await redisLoader();
  diff = Date.now() - startTime;
  logger.info(`Redis loaded (${diff}ms)`);

  // Load express loader
  startTime = Date.now();
  await expressLoader({ app: expressApp });
  diff = Date.now() - startTime;
  logger.info(`Express loaded (${diff}ms)`);

  // Load jobs
  startTime = Date.now();
  await workersLoader();
  diff = Date.now() - startTime;
  logger.info(`Workers loaded (${diff}ms)`);
};

export default initLoaders;
