import express from 'express';
import { logger } from '@/utils/logger';
import features from '@/config/features';

const router = express.Router();

// BES
import BESRouter from '@bes/api';
router.use('/bes', BESRouter);
logger.info('BES package loaded');

// AIM
import AIMRouter from '@aim/api';
router.use('/aim', AIMRouter);
logger.info('AIM package loaded');

import AnalogRouter from '@analog/api';
if (features.festifyAnalogService) {
  router.use('/analog', AnalogRouter);
  logger.info('Analog package loaded');
}

import BridgeRouter from '@bridge/api';
if (features.festifyBridgeService) {
  router.use('/bridge', BridgeRouter);
  logger.info('Bridge package loaded');
}

import MethodsRouter from '@methods/api';
if (features.festifyMethodsService) {
  router.use('/methods', MethodsRouter);
  logger.info('Methods package loaded');
}

export default router;
