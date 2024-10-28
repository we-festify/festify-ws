import express from 'express';
import { AuthMiddleware } from '@/api/middlewares/authentication';
import { PermissionController } from '../controllers/permission';
import { PolicyValidators } from '../validators/policy';

const router = express.Router();

const authMiddleware = new AuthMiddleware();
const permissionController = new PermissionController();
const policyValidators = new PolicyValidators();

router.get(
  '/',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  permissionController.getPoliciesByAccountId.bind(permissionController),
);
router.get(
  '/:policyId',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  permissionController.getPolicyById.bind(permissionController),
);
router.post(
  '/',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  policyValidators.validateCreatePolicy.bind(policyValidators),
  permissionController.createPolicy.bind(permissionController),
);
router.put(
  '/:policyId',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  policyValidators.validateUpdatePolicy.bind(policyValidators),
  permissionController.updatePolicy.bind(permissionController),
);
router.delete(
  '/:policyId',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  policyValidators.validateDeletePolicies.bind(policyValidators),
  permissionController.deletePolicies.bind(permissionController),
);
router.post(
  '/:policyId/users',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  policyValidators.validateAttachUsersToPolicy.bind(policyValidators),
  permissionController.attachUsersToPolicy.bind(permissionController),
);
router.delete(
  '/:policyId/users',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  policyValidators.validateDetachUsersFromPolicy.bind(policyValidators),
  permissionController.detachUsersFromPolicy.bind(permissionController),
);

export default router;
