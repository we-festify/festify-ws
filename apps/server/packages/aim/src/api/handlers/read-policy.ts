import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import PermissionPolicy from '@aim/models/permission-policy';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, null> = (resource) => {
  return validateFRNForServiceAndResourceType(resource, 'aim', 'policy');
};

const handlerWithoutDeps =
  (
    permissionPolicyModel: Model<IPermissionPolicy>,
  ): HandlerFunction<string, null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const { resourceId: alias } = parseFRN(resource);

    const policy = await permissionPolicyModel
      .findOne({
        account: accountId,
        alias,
      })
      .select('+rules');
    return { policy };
  };

const handler = handlerWithoutDeps(PermissionPolicy);

export const name = 'ReadPolicy';
export default handler;
