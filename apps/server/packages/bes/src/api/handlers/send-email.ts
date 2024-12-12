import { env } from '@/config';
import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { decryptUsingAES } from '@/utils/crypto';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BESInstance from '@bes/models/bes-instance';
import { sendEmail } from '@bes/utils/mailer';
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
    toAddresses: Joi.array().items(Joi.string().email()).required(),
    ccAddresses: Joi.array().items(Joi.string().email()).optional(),
    bccAddresses: Joi.array().items(Joi.string().email()).optional(),
    subject: Joi.string().required(),
    html: Joi.string().optional(),
    text: Joi.string().optional(),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

export const handlerWithoutDeps =
  (
    instanceModel: Model<IBESInstance>,
  ): HandlerFunction<
    string,
    {
      toAddresses: string[];
      ccAddresses?: string[];
      bccAddresses?: string[];
      subject: string;
      html?: string;
      text?: string;
    }
  > =>
  async (resource, data, context) => {
    const { accountId } = context.user;
    const { resourceId: alias } = parseFRN(resource);
    const { toAddresses, ccAddresses, bccAddresses, subject, html, text } =
      data;

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

    // Send email
    const senderPasswordDecrypted = decryptUsingAES(
      instance.senderPassword,
      senderPasswordEncryptionKey,
    );
    const response = await sendEmail({
      to: toAddresses,
      cc: ccAddresses,
      bcc: bccAddresses,
      subject,
      html,
      text,

      smtpConfig: {
        host: instance.smtpHost,
        port: instance.smtpPort,
        secure: false,
        auth: {
          user: instance.senderEmail,
          pass: senderPasswordDecrypted,
        },
      },
      from: instance.senderEmail,
    });

    return {
      messageId: response.messageId,
    };
  };

const handler = handlerWithoutDeps(BESInstance);

export const name = 'SendEmail';
export default handler;
