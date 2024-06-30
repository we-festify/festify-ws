import express from 'express';
const router = express.Router();

import besInternalRoutes from './bes/internal_routes';

import besExternalRoutes from './bes/external_routes';

router.use('/in/bes', besInternalRoutes);

router.use('/bes', besExternalRoutes);

export default router;
