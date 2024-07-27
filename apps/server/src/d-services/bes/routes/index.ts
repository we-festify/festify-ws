import express from 'express';
const router = express.Router();

import externalRoutes from './external_routes';
import internalRoutes from './internal_routes';

router.use('/v1', internalRoutes);
router.use('/', externalRoutes);

export default router;
