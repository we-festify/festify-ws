import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the API');
});

// auth routes
import authRoutes from './routes/auth';
router.use('/auth', authRoutes);

// packages
import packagesRoutes from './routes/packages';
router.use('/d', packagesRoutes);

// docs
import docsRoutes from './routes/docs';
router.use('/docs', docsRoutes);

export default router;
