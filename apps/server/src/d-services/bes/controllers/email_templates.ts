import { NextFunction, Response } from 'express';
// db
import { applicationDB } from '../../../config/db';

// models
import BESEmailTemplateCreator from '../models/BESEmailTemplate';
const BESEmailTemplate = BESEmailTemplateCreator(applicationDB);

// utils
import { BadRequestError } from '../../../utils/errors';

// middlewares
import { RequestWithUser } from '../../../middlewares/auth';

class EmailTemplatesController {
  static validateTemplate(template: {
    name: string;
    subject: string;
    body: string;
  }) {
    const { name, subject, body } = template;
    if (!name || !subject || !body) {
      throw new BadRequestError('Name, subject and body are required');
    }

    if (name.length < 3 || name.length > 50) {
      throw new BadRequestError(
        'Name length must be between 3 and 50 characters'
      );
    }

    if (subject.length < 3 || subject.length > 900) {
      throw new BadRequestError(
        'Subject length must be between 3 and 900 characters'
      );
    }
  }

  static extractVariables(subject: string, body: string) {
    const regex = /{{(.*?)}}/g;
    const matches = (subject + ' ' + body).match(regex);
    if (!matches) {
      return [];
    }

    const variableNames = matches.map((match) => match.replace(/{{|}}/g, ''));
    return [...new Set(variableNames)];
  }

  static async getTemplates(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { rootAccountId } = req.user;

      const templates = await BESEmailTemplate.find({
        account: rootAccountId,
      });

      res.status(200).json({ templates });
    } catch (error) {
      next(error);
    }
  }

  static async getTemplateById(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { rootAccountId } = req.user;
      const { templateId } = req.params;

      const template = await BESEmailTemplate.findOne({
        account: rootAccountId,
        _id: templateId,
      });
      if (!template) {
        throw new BadRequestError('Template not found');
      }

      res.status(200).json({ template });
    } catch (error) {
      next(error);
    }
  }

  static async createTemplate(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { rootAccountId } = req.user;
      const { name, subject, body } = req.body;

      const existingTemplate = await BESEmailTemplate.findOne({
        account: rootAccountId,
        name,
      });
      if (existingTemplate) {
        throw new BadRequestError('Template with same name already exists');
      }

      EmailTemplatesController.validateTemplate({ name, subject, body });

      const variables = EmailTemplatesController.extractVariables(
        subject,
        body
      );
      const template = new BESEmailTemplate({
        account: rootAccountId,
        name,
        subject,
        body,
        variables,
      });
      await template.save();

      res.status(201).json({ template });
    } catch (error) {
      next(error);
    }
  }

  static async updateTemplate(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { rootAccountId } = req.user;
      const { templateId } = req.params;
      const { name, subject, body } = req.body;

      const template = await BESEmailTemplate.findOne({
        account: rootAccountId,
        _id: templateId,
      });
      if (!template) {
        throw new BadRequestError('Template not found');
      }

      EmailTemplatesController.validateTemplate({ name, subject, body });

      template.name = name;
      template.subject = subject;
      template.body = body;
      template.variables = EmailTemplatesController.extractVariables(
        subject,
        body
      );
      await template.save();

      res.status(200).json({ template });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTemplates(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { rootAccountId } = req.user;
      const { templateIds } = req.body;

      await BESEmailTemplate.deleteMany({
        account: rootAccountId,
        _id: { $in: templateIds },
      });

      res.status(200).json({ message: 'Templates deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default EmailTemplatesController;
