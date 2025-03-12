import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BridgeApi from '@bridge/models/bridge-api';
import BridgeApiEndpoint from '@bridge/models/bridge-api-endpoint';
import { IBridgeApi, IBridgeApiEndpoint } from '@sharedtypes/bridge';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string[], null> = (
  resource,
  _data,
) => {
  const isValidResource = resource.every((r) =>
    validateFRNForServiceAndResourceType(r, 'bridge', 'api'),
  );

  return isValidResource;
};

const handlerWithoutDeps =
  (
    apiModel: Model<IBridgeApi>,
    endpointModel: Model<IBridgeApiEndpoint>,
  ): HandlerFunction<string[], null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const apiAliases = resource.map((r) => parseFRN(r).resourceId);

    const apis = await apiModel
      .find({ account: accountId, alias: { $in: apiAliases } })
      .select('_id')
      .lean();
    if (apis.length !== apiAliases.length) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'One or more APIs not found',
      );
    }

    const apiIdsToDelete = apis.map((a) => a._id);
    await Promise.all([
      apiModel.deleteMany({ _id: { $in: apiIdsToDelete } }),
      endpointModel.deleteMany({ api: { $in: apiIdsToDelete } }),
    ]);
  };

const handler = handlerWithoutDeps(BridgeApi, BridgeApiEndpoint);

export const name = 'DeleteApis';
export default handler;
