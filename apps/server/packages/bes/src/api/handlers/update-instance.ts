import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BESInstance from '@bes/models/bes-instance';
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
    instance: Joi.object().keys({
      alias: Joi.string(),

      senderName: Joi.string(),
      senderEmail: Joi.string().email(),
      senderPassword: Joi.string(),

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

    const existingInstance = await instanceModel.findOne({
      account: accountId,
      alias,
    });
    if (!existingInstance) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Instance not found',
      );
    }

    await instanceModel.updateOne(
      {
        account: accountId,
        alias,
      },
      instance,
    );
  };

const handler = handlerWithoutDeps(BESInstance);

export const name = 'UpdateInstance';
export default handler;
