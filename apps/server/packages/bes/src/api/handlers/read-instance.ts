import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { TokenPayload } from '@/types/services/auth';
import { validateFRNForService } from '@/utils/frn';
import BESInstance from '@bes/models/bes-instance';
import { IBESInstance } from '@sharedtypes/bes';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, null> = (resource) => {
  return validateFRNForService(resource, 'bes');
};

const handlerWithoutDeps =
  (instanceModel: Model<IBESInstance>): HandlerFunction<string, null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user as TokenPayload;
    const instance = await instanceModel.findOne({
      account: accountId,
      frn: resource,
    });
    return { instance };
  };

const handler = handlerWithoutDeps(BESInstance);

export const name = 'ReadInstance';
export default handler;
