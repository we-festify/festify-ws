import express from 'express';
const router = express.Router();
import cors from 'cors';

// cors
router.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','), // ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// routes
import instancesRouter from './instances';
import templatesRouter from './templates';
import docsRouter from './docs';

router.use('/instances', instancesRouter);
router.use('/templates', templatesRouter);
router.use('/docs', docsRouter);

export default router;
