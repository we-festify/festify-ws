import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BridgeApi from '@bridge/models/bridge-api';
import { IBridgeApi } from '@sharedtypes/bridge';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, null> = (resource, _data) => {
  const isValidResource = validateFRNForServiceAndResourceType(
    resource,
    'bridge',
    'api',
  );

  return isValidResource;
};

const handlerWithoutDeps =
  (apiModel: Model<IBridgeApi>): HandlerFunction<string, null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const { resourceId: alias } = parseFRN(resource);

    const foundApi = await apiModel.findOne({
      account: accountId,
      alias,
    });
    if (!foundApi) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'API not found',
      );
    }

    return { api: foundApi };
  };

const handler = handlerWithoutDeps(BridgeApi);

export const name = 'ReadApi';
export default handler;
