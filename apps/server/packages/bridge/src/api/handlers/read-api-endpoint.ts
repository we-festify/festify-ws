import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BridgeApiEndpoint from '@bridge/models/bridge-api-endpoint';
import { IBridgeApiEndpoint } from '@sharedtypes/bridge';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<[string, string], null> = (
  resource,
) => {
  const isValidResource =
    validateFRNForServiceAndResourceType(resource[0], 'bridge', 'api') &&
    validateFRNForServiceAndResourceType(resource[1], 'bridge', 'endpoint');

  return isValidResource;
};

const handlerWithoutDeps =
  (
    endpointModel: Model<IBridgeApiEndpoint>,
  ): HandlerFunction<[string, string], null> =>
  async (resource) => {
    const { resourceId: endpointId } = parseFRN(resource[1]);

    const endpoint = await endpointModel.findById(endpointId);
    if (!endpoint) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Endpoint not found',
      );
    }

    return { endpoint };
  };

const handler = handlerWithoutDeps(BridgeApiEndpoint);

export const name = 'ReadApiEndpoint';
export default handler;
