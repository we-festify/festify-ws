import { env } from '@/config';
import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { encryptUsingAES } from '@/utils/crypto';
import { AppError, CommonErrors } from '@/utils/errors';
import { EventsPublisher, publisher } from '@bes/events';
import BESInstance from '@bes/models/bes-instance';
import { generateInstanceEmailVerificationToken } from '@bes/utils/instance';
import {
  getInstanceVerificationEmail,
  getInstanceVerificationUrl,
} from '@bes/utils/instance-verification';
import { IBESInstance } from '@sharedtypes/bes';
import Joi from 'joi';
import { Model } from 'mongoose';

const senderPasswordEncryptionKey = env.bes.sender_password_secret;
if (!senderPasswordEncryptionKey) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    '"Sender password encryption key" not found in BES environment variables',
    true,
  );
}

export const validator: ValidatorFunction<null, unknown> = (_, data) => {
  const dataSchema = Joi.object().keys({
    instance: Joi.object().keys({
      alias: Joi.string().required(),

      senderName: Joi.string().required(),
      senderEmail: Joi.string().email().required(),
      senderPassword: Joi.string().required(),

      smtpHost: Joi.string().required(),
      smtpPort: Joi.number().required(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return !dataError;
};

const handlerWithoutDeps =
  (
    instanceModel: Model<IBESInstance>,
    eventsPublisher: EventsPublisher,
  ): HandlerFunction<
    null,
    {
      instance: IBESInstance;
    }
  > =>
  async (_resource, data, context) => {
    const { accountId } = context.user;
    const { instance } = data;

    const existingInstance = await instanceModel.findOne({
      account: accountId,
      alias: instance.alias,
    });
    if (existingInstance) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'Instance already exists',
      );
    }

    instance.senderPassword = encryptUsingAES(
      instance.senderPassword,
      senderPasswordEncryptionKey,
    );

    const createdInstance = await instanceModel.create({
      ...instance,
      account: accountId,
    });

    // send verification email
    const instanceVerificationToken = generateInstanceEmailVerificationToken(
      createdInstance._id,
    );
    const instanceVerificationUrl = getInstanceVerificationUrl(
      instanceVerificationToken,
    );
    const { subject, text } = getInstanceVerificationEmail(
      instanceVerificationUrl,
    );
    await eventsPublisher.emails.publishSendEmailEvent({
      to: instance.senderEmail,
      subject,
      text,
    });
  };

const handler = handlerWithoutDeps(BESInstance, publisher);

export const name = 'CreateInstance';
export default handler;
