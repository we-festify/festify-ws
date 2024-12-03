import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BESInstance from '@bes/models/bes-instance';
import { IBESInstance } from '@sharedtypes/bes';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string[], null> = (resource) => {
  return resource.every((r) =>
    validateFRNForServiceAndResourceType(r, 'bes', 'instance'),
  );
};

const handlerWithoutDeps =
  (instanceModel: Model<IBESInstance>): HandlerFunction<string[], null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const aliases = resource.map((frn) => parseFRN(frn).resourceId);

    await instanceModel.deleteMany({
      account: accountId,
      alias: { $in: aliases },
    });
  };

const handler = handlerWithoutDeps(BESInstance);

export const name = 'DeleteInstances';
export default handler;
