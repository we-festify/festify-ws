import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BridgeApiEndpoint from '@bridge/models/bridge-api-endpoint';
import { IBridgeApiEndpoint } from '@sharedtypes/bridge';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string[], null> = (resource) => {
  const isValidResource =
    validateFRNForServiceAndResourceType(resource[0], 'bridge', 'api') &&
    resource
      .slice(1)
      .every((r) =>
        validateFRNForServiceAndResourceType(r, 'bridge', 'endpoint'),
      );

  return isValidResource;
};

const handlerWithoutDeps =
  (endpointModel: Model<IBridgeApiEndpoint>): HandlerFunction<string[], null> =>
  async (resource) => {
    const apiId = parseFRN(resource[0]).resourceId;
    const endpointIds = resource.slice(1).map((r) => parseFRN(r).resourceId);

    const endpoints = await endpointModel
      .find({ api: apiId, _id: { $in: endpointIds } })
      .select('_id')
      .lean();
    if (endpoints.length !== endpointIds.length) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'One or more endpoints not found',
      );
    }

    const endpointIdsToDelete = endpoints.map((e) => e._id);
    await endpointModel.deleteMany({ _id: { $in: endpointIdsToDelete } });
  };

const handler = handlerWithoutDeps(BridgeApiEndpoint);

export const name = 'DeleteApiEndpoints';
export default handler;
