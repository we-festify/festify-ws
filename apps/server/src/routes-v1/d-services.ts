import express from 'express';
const router = express.Router();

// packages
import besRoutes from '@bes/index';

router.use('/bes', besRoutes);

export default router;
