import express from 'express';
const router = express.Router();
import cors from 'cors';

import AuthRoutes from './auth';
import ServicesRoutes from './services';

// cors
router.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','), // ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

router.use('/auth', AuthRoutes);
router.use('/services', ServicesRoutes);

export default router;
