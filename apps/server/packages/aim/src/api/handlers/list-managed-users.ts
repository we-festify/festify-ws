import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import ManagedUser from '@aim/models/managed-user';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, null> = () => true;

const handlerWithoutDeps =
  (managedUserModel: Model<IManagedUser>): HandlerFunction<null, null> =>
  async (_resource, _data, context) => {
    const { accountId } = context.user;
    const users = await managedUserModel.find({
      account: accountId,
    });
    return { users };
  };

const handler = handlerWithoutDeps(ManagedUser);

export const name = 'ListManagedUsers';
export default handler;
