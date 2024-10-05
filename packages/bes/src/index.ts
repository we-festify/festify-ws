import express from 'express';
const router = express.Router();

import besRoutes from './routes';
router.use(besRoutes);

export default router;
