import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BridgeApi from '@bridge/models/bridge-api';
import BridgeApiEndpoint from '@bridge/models/bridge-api-endpoint';
import { IBridgeApi, IBridgeApiEndpoint } from '@sharedtypes/bridge';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, null> = (resource) => {
  const isValidResource = validateFRNForServiceAndResourceType(
    resource,
    'bridge',
    'api',
  );

  return isValidResource;
};

const handlerWithoutDeps =
  (
    apiModel: Model<IBridgeApi>,
    endpointModel: Model<IBridgeApiEndpoint>,
  ): HandlerFunction<string, null> =>
  async (resource, _data, context) => {
    const { resourceId: apiAlias } = parseFRN(resource);
    const { accountId } = context.user;

    const api = await apiModel.findOne({ account: accountId, alias: apiAlias });
    if (!api) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'API not found',
      );
    }

    const endpoints = await endpointModel
      .find({
        account: accountId,
        api: api._id,
      })
      .select('-integration -policies');

    return { endpoints };
  };

const handler = handlerWithoutDeps(BridgeApi, BridgeApiEndpoint);

export const name = 'ListApiEndpoints';
export default handler;
