import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BESInstance from '@bes/models/bes-instance';
import { pushEmailToQueue } from '@bes/queues/email';
import { SendEmailData } from '@bes/types/handlers/send-email';
import { IBESInstance } from '@sharedtypes/bes';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, unknown> = (
  resource,
  data,
) => {
  const isValidResource = validateFRNForServiceAndResourceType(
    resource,
    'bes',
    'instance',
  );

  const dataSchema = Joi.object().keys({
    destination: Joi.object().keys({
      to: Joi.array().items(Joi.string()).required(),
      cc: Joi.array().items(Joi.string()).optional(),
      bcc: Joi.array().items(Joi.string()).optional(),
    }),
    subject: Joi.string().required(),
    content: Joi.object().keys({
      html: Joi.string().optional(),
      text: Joi.string().optional(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

export const handlerWithoutDeps =
  (
    instanceModel: Model<IBESInstance>,
  ): HandlerFunction<string, SendEmailData> =>
  async (resource, data, context) => {
    const { accountId } = context.user;
    const { resourceId: alias } = parseFRN(resource);

    const instance = await instanceModel
      .findOne({
        account: accountId,
        alias,
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

    // add job to queue
    const jobId = await pushEmailToQueue({
      destination: {
        to: data.destination.to,
        cc: data.destination.cc,
        bcc: data.destination.bcc,
      },
      subject: data.subject,
      content: {
        html: data.content.html,
        text: data.content.text,
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

const handler = handlerWithoutDeps(BESInstance);

export const name = 'SendEmail';
export default handler;
