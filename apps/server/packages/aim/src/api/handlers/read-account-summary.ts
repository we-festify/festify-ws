import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import ManagedUser from '@aim/models/managed-user';
import PermissionPolicy from '@aim/models/permission-policy';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import { IAccountSummary } from '@sharedtypes/aim/general';
import { Model } from 'mongoose';
import { IAccessKey } from '@sharedtypes/aim/access-key';
import AimAccessKey from '@aim/models/access-key';

export const validator: ValidatorFunction<null, null> = () => true;

const handlerWithoutDeps =
  (
    managedUserModel: Model<IManagedUser>,
    permissionPolicyModel: Model<IPermissionPolicy>,
    accessKeyModel: Model<IAccessKey>,
  ): HandlerFunction<null, null> =>
  async (_resource, _data, context) => {
    const { accountId } = context.user;

    const managedUserIds = await managedUserModel
      .find({ account: accountId })
      .select('_id');
    const permissionPoliciesCount = await permissionPolicyModel.countDocuments({
      account: accountId,
    });
    const accessKeysCount = await accessKeyModel.countDocuments({
      user: { $in: managedUserIds },
    });

    return {
      managedUsersCount: managedUserIds.length,
      permissionPoliciesCount,
      accessKeysCount,
    } as IAccountSummary;
  };

const handler = handlerWithoutDeps(ManagedUser, PermissionPolicy, AimAccessKey);

export const name = 'ReadAccountSummary';
export default handler;
