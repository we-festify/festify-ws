import express from 'express';
import { logger } from '@/utils/logger';

const router = express.Router();

// BES
import BESRouter from '@bes/api';
router.use('/bes', BESRouter);
logger.info('BES package loaded');

// AIM
import AIMRouter from '@aim/api';
router.use('/aim', AIMRouter);
logger.info('AIM package loaded');

export default router;
