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

// AIM
import AIMRouter from '@aim/api';
router.use('/aim', AIMRouter);

if (features.festifyAnalogService) {
  import('@analog/api').then((AnalogRouter) => {
    router.use('/analog', AnalogRouter.default);
  });
}

if (features.festifyBridgeService) {
  import('@bridge/api').then((BridgeRouter) => {
    router.use('/bridge', BridgeRouter.default);
  });
}

if (features.festifyMethodsService) {
  import('@methods/api').then((MethodsRouter) => {
    router.use('/methods', MethodsRouter.default);
  });
}

export default router;
