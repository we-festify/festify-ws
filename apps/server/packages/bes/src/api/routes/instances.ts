import express from 'express';

const router = express.Router();
import { InstanceController } from '../controllers/instance';
import { InstanceValidators } from '../validators/instance';
import { AuthMiddleware } from '@/api/middlewares/authentication';

const instanceController = new InstanceController();
const instanceValidators = new InstanceValidators();
const authMiddleware = new AuthMiddleware();

// rrequire authentication for all routes
router.use(authMiddleware.requireAuthenticated.bind(authMiddleware));

router.get('/', instanceController.getInstances.bind(instanceController));
router.get(
  '/alias/:alias',
  instanceValidators.validateGetInstanceByAlias.bind(instanceValidators),
  instanceController.getInstanceByAlias.bind(instanceController),
);
router.get(
  '/:id',
  instanceValidators.validateGetInstanceById.bind(instanceValidators),
  instanceController.getInstanceById.bind(instanceController),
);
router.post(
  '/',
  instanceValidators.validateCreateInstance.bind(instanceValidators),
  instanceController.createInstance.bind(instanceController),
);
router.put(
  '/:id',
  instanceValidators.validateUpdateInstance.bind(instanceValidators),
  instanceController.updateInstance.bind(instanceController),
);
router.delete(
  '/',
  instanceValidators.validateDeleteInstances.bind(instanceValidators),
  instanceController.deleteInstances.bind(instanceController),
);

export default router;
