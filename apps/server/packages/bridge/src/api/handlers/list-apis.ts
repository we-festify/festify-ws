import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import BridgeApi from '@bridge/models/bridge-api';
import { IBridgeApi } from '@sharedtypes/bridge';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, null> = () => true;

const handlerWithoutDeps =
  (apiModel: Model<IBridgeApi>): HandlerFunction<null, null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;

    const apis = await apiModel.find({ account: accountId });

    return { apis };
  };

const handler = handlerWithoutDeps(BridgeApi);

export const name = 'ListApis';
export default handler;
