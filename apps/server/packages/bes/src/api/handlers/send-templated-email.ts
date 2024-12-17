import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import { EventsPublisher, publisher } from '@bes/events';
import BESEmailTemplate from '@bes/models/bes-email-template';
import BESInstance from '@bes/models/bes-instance';
import { SendTemplatedEmailData } from '@bes/types/handlers/send-email';
import { replaceVariables } from '@bes/utils/email-template';
import { IBESEmailTemplate, IBESInstance } from '@sharedtypes/bes';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string[], unknown> = (
  resource,
  data,
) => {
  const isValidResource =
    validateFRNForServiceAndResourceType(resource[0], 'bes', 'instance') &&
    validateFRNForServiceAndResourceType(resource[1], 'bes', 'template');

  const dataSchema = Joi.object().keys({
    destination: Joi.object().keys({
      to: Joi.array().items(Joi.string()).required(),
      cc: Joi.array().items(Joi.string()).optional(),
      bcc: Joi.array().items(Joi.string()).optional(),
    }),
    variables: Joi.object(),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

export const handlerWithoutDeps =
  (
    instanceModel: Model<IBESInstance>,
    emailTemplateModel: Model<IBESEmailTemplate>,
    eventsPublisher: EventsPublisher,
  ): HandlerFunction<string[], SendTemplatedEmailData> =>
  async (resource, data, context) => {
    const { accountId } = context.user;
    const { resourceId: instanceAlias } = parseFRN(resource[0]);
    const { resourceId: templateId } = parseFRN(resource[1]);

    const instance = await instanceModel
      .findOne({
        account: accountId,
        alias: instanceAlias,
      })
      .select('+senderPassword');
    if (!instance) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        `Instance not found`,
      );
    }

    if (instance.status !== 'active') {
      throw new AppError(
        CommonErrors.Forbidden.name,
        CommonErrors.Forbidden.statusCode,
        `Instance is not active`,
      );
    }

    // get template
    const template = await emailTemplateModel.findOne({
      account: accountId,
      _id: templateId,
    });
    if (!template) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        `Template not found`,
      );
    }

    // replace variables in template body, subject
    const subject = template.subject;
    const body = template.body;
    const replacedBody = replaceVariables(body, data.variables);
    const replacedSubject = replaceVariables(subject, data.variables);

    // add job to queue
    const jobId = await eventsPublisher.handlers.publishSendEmailEvent({
      destination: {
        to: data.destination.to,
        cc: data.destination.cc,
        bcc: data.destination.bcc,
      },
      subject: replacedSubject,
      content: {
        text: replacedBody,
      },
      sender: {
        email: instance.senderEmail,
        encryptedPassword: instance.senderPassword,
        name: instance.senderName,
      },
      smtp: {
        host: instance.smtpHost,
        port: instance.smtpPort,
      },
    });

    return { jobId };
  };

const handler = handlerWithoutDeps(BESInstance, BESEmailTemplate, publisher);

export const name = 'SendTemplatedEmail';
export default handler;
