import express from 'express';
const router = express.Router();
import cors from 'cors';

// controllers
import EmailTemplatesController from './controllers/email_templates';

// middlewares
import { RequestWithUser, requireAuth } from '../../middlewares/auth';

// cors
router.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','), // ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

router.use(requireAuth as unknown as express.RequestHandler);

router.get(
  '/:instanceId/templates',
  EmailTemplatesController.getTemplatesByInstanceId as unknown as express.RequestHandler<RequestWithUser>
);
router.post(
  '/:instanceId/templates',
  EmailTemplatesController.createTemplate as unknown as express.RequestHandler<RequestWithUser>
);
router.put(
  '/:instanceId/templates/:templateId',
  EmailTemplatesController.updateTemplate as unknown as express.RequestHandler<RequestWithUser>
);
router.delete(
  '/:instanceId/templates/:templateId',
  EmailTemplatesController.deleteTemplate as unknown as express.RequestHandler<RequestWithUser>
);

export default router;
