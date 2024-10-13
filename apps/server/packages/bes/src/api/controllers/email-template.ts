import * as e from 'express';
import { EmailTemplateService } from '@bes/services/email-template';
import BESEmailTemplate from '@bes/models/bes-email-template';

export class EmailTemplateController {
  private readonly emailTemplateService: EmailTemplateService;

  constructor() {
    this.emailTemplateService = new EmailTemplateService(BESEmailTemplate);
  }

  public async getEmailTemplates(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;

      const emailTemplates =
        await this.emailTemplateService.getEmailTemplatesByAccount(accountId);

      res.status(200).json({ templates: emailTemplates });
    } catch (err) {
      next(err);
    }
  }

  public async getEmailTemplateById(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;
      const { id } = req.params;

      const emailTemplate =
        await this.emailTemplateService.getEmailTemplateById(id, accountId);

      res.status(200).json({ template: emailTemplate });
    } catch (err) {
      next(err);
    }
  }

  public async createEmailTemplate(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;
      const template = req.body;

      const emailTemplate = await this.emailTemplateService.createEmailTemplate(
        template,
        accountId,
      );

      res.status(201).json({ template: emailTemplate });
    } catch (err) {
      next(err);
    }
  }

  public async updateEmailTemplate(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;
      const { id } = req.params;
      const template = req.body;

      const emailTemplate =
        await this.emailTemplateService.updateEmailTemplateById(
          id,
          template,
          accountId,
        );

      res.status(200).json({ template: emailTemplate });
    } catch (err) {
      next(err);
    }
  }

  public async deleteEmailTemplates(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const { accountId } = req.user;
      const { ids } = req.body;

      await this.emailTemplateService.deleteOneOrManyEmailTemplates(
        ids,
        accountId,
      );

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
