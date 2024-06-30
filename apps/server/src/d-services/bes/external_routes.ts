import express from 'express';
const router = express.Router();
import cors from 'cors';

// controllers
import EmailController from './controllers/email';

// middlewares
import {
  RequestWithInstance,
  requireAuthByAPIKey,
} from '../../middlewares/auth';
import { trackApiRequest } from '../../middlewares/analytics';

// dynamic cors origin
router.use(
  cors({
    origin: '*', // allow all origins - will be checked in requireAuthByAPIKey
  })
);

router.use(
  requireAuthByAPIKey as unknown as express.RequestHandler<RequestWithInstance>
);
router.use(
  trackApiRequest as unknown as express.RequestHandler<RequestWithInstance>
);

router.post(
  '/send-one',
  EmailController.externalSendToOne as unknown as express.RequestHandler<RequestWithInstance>
);
router.post(
  '/send-many',
  EmailController.externalSendToMany as unknown as express.RequestHandler<RequestWithInstance>
);

export default router;
