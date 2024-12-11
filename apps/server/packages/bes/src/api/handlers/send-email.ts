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

  const dataSchema = Joi.object().keys({});
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

export const handlerWithoutDeps =
  (instanceModel: Model<IBESInstance>): HandlerFunction<string, null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const { resourceId: alias } = parseFRN(resource);

    const instance = await instanceModel.findOne({
      account: accountId,
      alias,
    });
    if (!instance) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        `Instance not found`,
      );
    }
  };

const handler = handlerWithoutDeps(BESInstance);

export const name = 'SendEmail';
export default handler;
