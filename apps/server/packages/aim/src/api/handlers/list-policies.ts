import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import PermissionPolicy from '@aim/models/permission-policy';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, null> = () => true;

const handlerWithoutDeps =
  (
    permissionPolicyModel: Model<IPermissionPolicy>,
  ): HandlerFunction<null, null> =>
  async (_resource, _data, context) => {
    const { accountId } = context.user;
    const policies = await permissionPolicyModel.find({
      account: accountId,
    });
    return { policies };
  };

const handler = handlerWithoutDeps(PermissionPolicy);

export const name = 'ListPolicies';
export default handler;
