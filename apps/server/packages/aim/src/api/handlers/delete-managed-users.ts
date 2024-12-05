import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import ManagedUser from '@aim/models/managed-user';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string[], null> = (resource) => {
  return resource.every((r) =>
    validateFRNForServiceAndResourceType(r, 'aim', 'user'),
  );
};

const handlerWithoutDeps =
  (managedUserModel: Model<IManagedUser>): HandlerFunction<string[], null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const aliases = resource.map((frn) => parseFRN(frn).resourceId);

    await managedUserModel.deleteMany({
      account: accountId,
      alias: { $in: aliases },
    });
  };

const handler = handlerWithoutDeps(ManagedUser);

export const name = 'DeleteManagedUsers';
export default handler;
