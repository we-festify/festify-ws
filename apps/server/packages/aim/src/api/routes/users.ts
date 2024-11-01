import express from 'express';
import { UserController } from '../controllers/user';
import { UserValidators } from '../validators/user';
import { AuthMiddleware } from '@/api/middlewares/authentication';

const router = express.Router();

const userController = new UserController();
const userValidators = new UserValidators();
const authMiddleware = new AuthMiddleware();

router.get(
  '/',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  userController.getUsers.bind(userController),
);
router.get(
  '/:userId',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  userController.getUserById.bind(userController),
);
router.post(
  '/',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  userValidators.validateCreateUser.bind(userValidators),
  userController.createUser.bind(userController),
);
router.put(
  '/:userId',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  userValidators.validateUpdateUser.bind(userValidators),
  userController.updateUser.bind(userController),
);
router.delete(
  '/',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  userValidators.validateDeleteUsers.bind(userValidators),
  userController.deleteUsers.bind(userController),
);
router.post(
  '/:userId/policies',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  userValidators.validateAttachPoliciesToUser.bind(userValidators),
  userController.attachPoliciesToUser.bind(userController),
);
router.delete(
  '/:userId/policies',
  authMiddleware.requireAuthenticated.bind(authMiddleware),
  userValidators.validateDetachPoliciesFromUser.bind(userValidators),
  userController.detachPoliciesFromUser.bind(userController),
);

export default router;
