import express, { RequestHandler } from 'express';
const router = express.Router();

import InstancesController from '../controllers/instances';
import { requireAuth, RequestWithUser } from '../middlewares/auth';

router.get(
  '/:serviceType',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  InstancesController.getInstances as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/:serviceType/:instanceId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  InstancesController.getInstance as unknown as RequestHandler<RequestWithUser>
);
router.post(
  '/:serviceType',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  InstancesController.createInstance as unknown as RequestHandler<RequestWithUser>
);
router.patch(
  '/:serviceType/:instanceId',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  InstancesController.updateInstance as unknown as RequestHandler<RequestWithUser>
);
router.put(
  '/:serviceType/:instanceId/creds',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  InstancesController.updateCreds as unknown as RequestHandler<RequestWithUser>
);

export default router;
