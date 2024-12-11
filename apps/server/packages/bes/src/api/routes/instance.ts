import express from 'express';
import InstanceController from '../controllers/instance';
import BESInstance from '@bes/models/bes-instance';
import { RateLimiterMiddleware } from '@/api/middlewares/rate-limit';
import { InstanceValidators } from '../validators/instance';

const router = express.Router();
const instanceController = new InstanceController(BESInstance);
const instanceValidators = new InstanceValidators();
const rateLimiterMiddleware = new RateLimiterMiddleware();

router.get(
  '/verify-email',
  rateLimiterMiddleware.limiter,
  instanceValidators.verifyInstanceEmail.bind(instanceValidators),
  instanceController.verifyInstanceEmail.bind(instanceController),
);

export default router;
