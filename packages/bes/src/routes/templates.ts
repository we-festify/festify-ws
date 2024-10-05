import express from 'express';
const router = express.Router();

import EmailTemplatesController from '../controllers/email_templates';
import { RequestWithUser, requireAuth } from '@root/middlewares/auth';

router.get(
  '/',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  EmailTemplatesController.getTemplates as unknown as express.RequestHandler<RequestWithUser>
);
router.get(
  '/:templateId',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  EmailTemplatesController.getTemplateById as unknown as express.RequestHandler<RequestWithUser>
);
router.post(
  '/',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  EmailTemplatesController.createTemplate as unknown as express.RequestHandler<RequestWithUser>
);
router.put(
  '/:templateId',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  EmailTemplatesController.updateTemplate as unknown as express.RequestHandler<RequestWithUser>
);
router.delete(
  '/',
  requireAuth as unknown as express.RequestHandler<RequestWithUser>,
  EmailTemplatesController.deleteTemplates as unknown as express.RequestHandler<RequestWithUser>
);

export default router;
