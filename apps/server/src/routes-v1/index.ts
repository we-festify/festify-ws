import express from 'express';
const router = express.Router();
import cors from 'cors';

import AuthRoutes from './auth';
import DocsRoutes from '@root/routes/docs';

// cors
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(','), // ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
};

router.use('/auth', cors(corsOptions), AuthRoutes);
router.use('/docs', cors(corsOptions), DocsRoutes);

// d-services
import DServicesRoutes from './d-services';
router.use('/d', DServicesRoutes);

export default router;
