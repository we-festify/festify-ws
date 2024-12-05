import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BESInstance from '@bes/models/bes-instance';
import { IBESInstance } from '@sharedtypes/bes';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, null> = (resource) => {
  return validateFRNForServiceAndResourceType(resource, 'bes', 'instance');
};

const handlerWithoutDeps =
  (instanceModel: Model<IBESInstance>): HandlerFunction<string, null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const { resourceId: alias } = parseFRN(resource);

    const instance = await instanceModel.findOne({
      account: accountId,
      alias,
    });
    return { instance };
  };

const handler = handlerWithoutDeps(BESInstance);

export const name = 'ReadInstance';
export default handler;
