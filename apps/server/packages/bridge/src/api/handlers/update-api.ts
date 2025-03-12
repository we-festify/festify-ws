import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BridgeApi from '@bridge/models/bridge-api';
import { IBridgeApi } from '@sharedtypes/bridge';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, unknown> = (
  resource,
  data,
) => {
  const isValidResource = validateFRNForServiceAndResourceType(
    resource,
    'bridge',
    'api',
  );

  const dataSchema = Joi.object().keys({
    api: Joi.object().keys({
      alias: Joi.string().optional(),
      description: Joi.string().min(0).max(500).optional(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

const handlerWithoutDeps =
  (
    apiModel: Model<IBridgeApi>,
  ): HandlerFunction<string, { api: Partial<IBridgeApi> }> =>
  async (resource, data, context) => {
    const { accountId } = context.user;
    const { api } = data;
    const { resourceId: alias } = parseFRN(resource);

    const existingApi = await apiModel.findOne({
      account: accountId,
      alias,
    });
    if (!existingApi) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'API not found',
      );
    }

    if (api.alias) {
      const existingApiWithAlias = await apiModel.findOne({
        account: accountId,
        alias: api.alias,
      });
      if (
        existingApiWithAlias &&
        existingApiWithAlias._id !== existingApi._id
      ) {
        throw new AppError(
          CommonErrors.Conflict.name,
          CommonErrors.Conflict.statusCode,
          'Alias already in use',
        );
      }
    }

    await existingApi.updateOne(api);
  };

const handler = handlerWithoutDeps(BridgeApi);

export const name = 'UpdateApi';
export default handler;
