import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import ManagedUser from '@aim/models/managed-user';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, null> = (resource) => {
  return validateFRNForServiceAndResourceType(resource, 'aim', 'user');
};

const handlerWithoutDeps =
  (managedUserModel: Model<IManagedUser>): HandlerFunction<string, null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const { resourceId: alias } = parseFRN(resource);

    const user = await managedUserModel.findOne({
      account: accountId,
      alias,
    });
    return { user };
  };

const handler = handlerWithoutDeps(ManagedUser);

export const name = 'ReadManagedUser';
export default handler;
