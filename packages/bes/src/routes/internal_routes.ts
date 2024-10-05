import express from 'express';
const router = express.Router();
import cors from 'cors';

const { ALLOWED_ORIGINS = 'http://localhost:3000' } = process.env;

// cors
router.use(
  cors({
    origin: ALLOWED_ORIGINS?.split(','), // ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// routes
import instancesRouter from './instances';
import templatesRouter from './templates';

router.use('/instances', instancesRouter);
router.use('/templates', templatesRouter);

export default router;
