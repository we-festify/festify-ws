import express from 'express';
const router = express.Router();

import besRoutes from './bes/routes';

router.use('/bes', besRoutes);

export default router;
