import express from 'express';
const router = express.Router();

import InstancesController from '../controllers/instance';
import { requireAuth, RequestWithUser } from '@root/middlewares/auth';

router.get(
  '/',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  InstancesController.getInstances as unknown as express.RequestHandler<RequestWithUser>
);
router.get(
  '/:instanceId',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  InstancesController.getInstanceById as unknown as express.RequestHandler<RequestWithUser>
);
router.get(
  '/alias/:alias',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  InstancesController.getInstanceByAlias as unknown as express.RequestHandler<RequestWithUser>
);
router.post(
  '/',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  InstancesController.createInstance as unknown as express.RequestHandler<RequestWithUser>
);
router.put(
  '/:instanceId',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  InstancesController.updateInstance as unknown as express.RequestHandler<RequestWithUser>
);
router.delete(
  '/',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  InstancesController.deleteInstances as unknown as express.RequestHandler<RequestWithUser>
);

export default router;
