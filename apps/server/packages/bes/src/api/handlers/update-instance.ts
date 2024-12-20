import { env } from '@/config';
import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { encryptUsingAES } from '@/utils/crypto';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
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

const smtpPasswordEncryptionKey = env.bes.smtp_password_secret;
if (!smtpPasswordEncryptionKey) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    '"Sender password encryption key" not found in BES environment variables',
    true,
  );
}

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
    instance: Joi.object().keys({
      alias: Joi.string(),

      senderName: Joi.string(),
      senderEmail: Joi.string().email(),

      smtpUser: Joi.string(),
      smtpPassword: Joi.string(),
      smtpHost: Joi.string(),
      smtpPort: Joi.number(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

const handlerWithoutDeps =
  (
    instanceModel: Model<IBESInstance>,
    eventsPublisher: EventsPublisher,
  ): HandlerFunction<
    string,
    {
      instance: IBESInstance;
    }
  > =>
  async (resource, data, context) => {
    const { accountId } = context.user;
    const { instance } = data;
    const { resourceId: alias } = parseFRN(resource);

    const foundInstance = await instanceModel.findOne({
      account: accountId,
      alias,
    });
    if (!foundInstance) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Instance not found',
      );
    }

    if (instance.alias) {
      const existingInstanceWithAlias = await instanceModel.findOne({
        account: accountId,
        alias: instance.alias,
      });
      if (
        existingInstanceWithAlias &&
        existingInstanceWithAlias._id.toString() !==
          foundInstance._id.toString()
      ) {
        throw new AppError(
          CommonErrors.Conflict.name,
          CommonErrors.Conflict.statusCode,
          'Alias already in use',
        );
      }
    }

    if (
      instance.senderEmail &&
      instance.senderEmail !== foundInstance.senderEmail
    ) {
      instance.status = 'unverified';

      // send verification email
      const instanceVerificationToken = generateInstanceEmailVerificationToken(
        foundInstance._id,
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
    }

    instance.smtpPassword = encryptUsingAES(
      instance.smtpPassword,
      smtpPasswordEncryptionKey,
    );

    await instanceModel.updateOne(
      {
        account: accountId,
        alias,
      },
      instance,
    );
  };

const handler = handlerWithoutDeps(BESInstance, publisher);

export const name = 'UpdateInstance';
export default handler;
