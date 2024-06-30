import nodemailer from 'nodemailer';
import validator from 'validator';

// db
import { applicationDB } from '../../../config/db';

// models
import EmailTemplateCreator from '../models/EmailTemplate';
import InstanceCreator from '@shared/models/Instance';
const EmailTemplate = EmailTemplateCreator(applicationDB);
const Instance = InstanceCreator(applicationDB);

// utils
import { decrypt } from '../utils/encrypt';
import { BadRequestError, NotFoundError } from '../../../utils/errors';
import { BESCredsType } from '@shared/types';
import { RequestWithInstance } from '@server/middlewares/auth';
import { Response, NextFunction } from 'express';

class EmailController {
  static createTransporter(creds: BESCredsType) {
    const decryptedPassword = decrypt(creds.password);

    return nodemailer.createTransport({
      host: creds.smtpHost,
      port: creds.smtpPort,
      secure: false,
      auth: {
        user: creds.email,
        pass: decryptedPassword,
      },
    });
  }

  static fillVariables(
    text: string,
    data: Record<string, string>,
    variables: string[] = []
  ) {
    const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
    return text.replace(regex, (match, variable) => {
      if (variables.includes(variable)) {
        return data[variable];
      }
      return match;
    });
  }

  // external API function
  static async externalSendToOne(
    req: RequestWithInstance,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        to,
        templateId,
        data = {},
      } = req.body as unknown as {
        to?: string;
        templateId?: string;
        data?: Record<string, string>;
      };

      if (!to || !templateId) {
        throw new BadRequestError('To and template ID are required');
      }
      if (!validator.isEmail(to)) {
        throw new BadRequestError('Invalid email address');
      }

      const { _id: instanceId } = req.instance;

      // instance will always be there
      // already checked in requireAuthByAPIKey middleware
      const instance = await Instance.findById(instanceId).populate('creds');

      if (!instance) {
        throw new NotFoundError('Invalid instance');
      }

      const creds = instance.creds as BESCredsType;

      const template = await EmailTemplate.findOne({
        _id: templateId,
        instance: instanceId,
      });
      if (!template) {
        throw new NotFoundError('Invalid template');
      }

      const transporter = EmailController.createTransporter(
        creds as BESCredsType
      );
      const filledBody = EmailController.fillVariables(
        template.body,
        data,
        template.variables
      );
      const filledSubject = EmailController.fillVariables(
        template.subject,
        data,
        template.variables
      );
      const mailOptions = {
        from: creds.email,
        to,
        subject: filledSubject,
        text: filledBody,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          throw new Error('Error sending email');
        } else {
          res.status(200).json({ message: 'Email sent successfully' });
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // external API function
  static async externalSendToMany(
    req: RequestWithInstance,
    res: Response,
    next: NextFunction
  ) {
    try {
      let { to } = req.body as unknown as { to?: string[] };
      const { templateId, data = {} } = req.body as unknown as {
        templateId?: string;
        data?: Record<string, string>;
      };

      if (!to || !templateId) {
        throw new BadRequestError('To and template ID are required');
      }
      if (!Array.isArray(to)) {
        throw new BadRequestError('To should be an array');
      }
      to = to.filter((email) => validator.isEmail(email));
      if (to.length === 0) {
        throw new BadRequestError(
          'Invalid email(s) or no valid email(s) found'
        );
      }

      const { _id: instanceId } = req.instance;

      const instance = await Instance.findById(instanceId).populate('creds');

      if (!instance) {
        throw new NotFoundError('Invalid instance');
      }

      const creds = instance.creds as BESCredsType;

      const template = await EmailTemplate.findOne({
        _id: templateId,
        instance: instanceId,
      });
      if (!template) {
        throw new NotFoundError('Invalid template');
      }

      const transporter = EmailController.createTransporter(creds);
      const filledBody = EmailController.fillVariables(
        template.body,
        data,
        template.variables
      );
      const filledSubject = EmailController.fillVariables(
        template.subject,
        data,
        template.variables
      );
      const mailOptions = {
        from: creds.email,
        to,
        subject: filledSubject,
        text: filledBody,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          throw new Error('Error sending email');
        } else {
          res.status(200).json({ message: 'Email sent successfully' });
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default EmailController;
