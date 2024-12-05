import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import ManagedUser from '@aim/models/managed-user';
import PermissionPolicy from '@aim/models/permission-policy';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, null> = (resource) => {
  return validateFRNForServiceAndResourceType(resource, 'aim', 'policy');
};

const handlerWithoutDeps =
  (
    permissionPolicyModel: Model<IPermissionPolicy>,
    managedUserModel: Model<IManagedUser>,
  ): HandlerFunction<string, null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const { resourceId: policyAlias } = parseFRN(resource);

    const policy = await permissionPolicyModel.findOne({
      account: accountId,
      alias: policyAlias,
    });
    if (!policy) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        `Policy with alias ${policyAlias} not found`,
      );
    }

    const users = await managedUserModel.find({
      account: accountId,
      policies: policy._id,
    });
    return { users };
  };

const handler = handlerWithoutDeps(PermissionPolicy, ManagedUser);

export const name = 'ListPolicyAttachedUsers';
export default handler;
