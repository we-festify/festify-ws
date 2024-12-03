import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import BESInstance from '@bes/models/bes-instance';
import { IBESInstance } from '@sharedtypes/bes';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, null> = () => true;

const handlerWithoutDeps =
  (instanceModel: Model<IBESInstance>): HandlerFunction<null, null> =>
  async (_resource, _data, context) => {
    const { accountId } = context.user;
    const instances = await instanceModel.find({
      account: accountId,
    });
    return { instances };
  };

const handler = handlerWithoutDeps(BESInstance);

export const name = 'ListInstances';
export default handler;
