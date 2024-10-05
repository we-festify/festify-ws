import express, { RequestHandler } from 'express';
const router = express.Router();

import AuthController from '../controllers/auth';
import { RequestWithUser, requireAuth } from '@root/middlewares/auth';

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/refresh', AuthController.refreshToken);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get(
  '/me',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  AuthController.me as unknown as RequestHandler<RequestWithUser>
);
router.get(
  '/logout',
  requireAuth as unknown as RequestHandler<RequestWithUser>,
  AuthController.logout as unknown as RequestHandler<RequestWithUser>
);

export default router;
