import express from 'express';
import { logger } from '@/utils/logger';
import features from '@/config/features';

const router = express.Router();

logger.info(
  Object.entries({
    BES: true,
    AIM: true,
    Analog: features.festifyAnalogService,
    Bridge: features.festifyBridgeService,
    Methods: features.festifyMethodsService,
  })
    .filter(([, enabled]) => enabled)
    .map(([name]) => name)
    .join(', ') + ' services enabled',
);

// BES
import BESRouter from '@bes/api';
router.use('/bes', BESRouter);
logger.info('[BES] service enabled');

// AIM
import AIMRouter from '@aim/api';
router.use('/aim', AIMRouter);
logger.info('[AIM] service enabled');

import AnalogRouter from '@analog/api';
if (features.festifyAnalogService) {
  router.use('/analog', AnalogRouter);
  logger.info('[Analog] service enabled');
}

import BridgeRouter from '@bridge/api';
if (features.festifyBridgeService) {
  router.use('/bridge', BridgeRouter);
  logger.info('[Bridge] service enabled');
}

import MethodsRouter from '@methods/api';
if (features.festifyMethodsService) {
  router.use('/methods', MethodsRouter);
  logger.info('[Methods] service enabled');
}

export default router;
