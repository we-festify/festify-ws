import express from 'express';

const router = express.Router();
import { EmailTemplateController } from '../controllers/email-template';
import { EmailTemplateValidators } from '../validators/email-template';
import { AuthMiddleware } from '@/api/middlewares/authentication';

const emailTemplateController = new EmailTemplateController();
const emailTemplateValidators = new EmailTemplateValidators();
const authMiddleware = new AuthMiddleware();

// rrequire authentication for all routes
router.use(authMiddleware.requireAuthenticated.bind(authMiddleware));

router.get(
  '/',
  emailTemplateController.getEmailTemplates.bind(emailTemplateController),
);
router.get(
  '/:id',
  emailTemplateValidators.validateGetEmailTemplateById.bind(
    emailTemplateValidators,
  ),
  emailTemplateController.getEmailTemplateById.bind(emailTemplateController),
);
router.post(
  '/',
  emailTemplateValidators.validateCreateEmailTemplate.bind(
    emailTemplateValidators,
  ),
  emailTemplateController.createEmailTemplate.bind(emailTemplateController),
);
router.put(
  '/:id',
  emailTemplateValidators.validateUpdateEmailTemplate.bind(
    emailTemplateValidators,
  ),
  emailTemplateController.updateEmailTemplate.bind(emailTemplateController),
);
router.delete(
  '/',
  emailTemplateValidators.validateDeleteEmailTemplates.bind(
    emailTemplateValidators,
  ),
  emailTemplateController.deleteEmailTemplates.bind(emailTemplateController),
);

export default router;
