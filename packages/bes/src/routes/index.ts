import express from 'express';
const router = express.Router();

import externalRoutes from './external_routes';
import internalRoutes from './internal_routes';

router.use('/in', internalRoutes);
router.use('/', externalRoutes);

export default router;
