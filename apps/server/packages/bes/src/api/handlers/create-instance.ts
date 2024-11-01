import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { TokenPayload } from '@/types/services/auth';
import BESInstance from '@bes/models/bes-instance';
import { IBESInstance } from '@sharedtypes/bes';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, unknown> = (_, data) => {
  const schema = Joi.object().keys({
    alias: Joi.string().required(),

    senderName: Joi.string().required(),
    senderEmail: Joi.string().email().required(),
    senderPassword: Joi.string().required(),

    smtpHost: Joi.string().required(),
    smtpPort: Joi.number().required(),
  });

  const { error } = schema.validate(data);
  return !error;
};

const handlerWithoutDeps =
  (
    instanceModel: Model<IBESInstance>,
  ): HandlerFunction<
    null,
    {
      instance: IBESInstance | null;
    }
  > =>
  async (_resource, data, context) => {
    const { accountId } = context.user as TokenPayload;
    await instanceModel.create({
      ...data.instance,
      accountId,
    });
    return { message: 'Instance created successfully' };
  };

const handler = handlerWithoutDeps(BESInstance);

export const name = 'CreateInstance';
export default handler;
