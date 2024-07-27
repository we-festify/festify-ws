import express, { RequestHandler } from 'express';
const router = express.Router();

import ServiceController from '../controllers/services';
import { requireAuth, RequestWithUser } from '../middlewares/auth';

router.get(
  '/all',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  ServiceController.getAllAvailableServicesMeta as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/:serviceType',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  ServiceController.getServiceMetaByType as unknown as RequestHandler<RequestWithUser>
);

export default router;
