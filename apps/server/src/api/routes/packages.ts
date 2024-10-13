import express from 'express';
import { logger } from '@/utils/logger';

const router = express.Router();

// BES
import BESRouter from '@bes/api';
router.use('/bes', BESRouter);
logger.info('BES package loaded');

export default router;
