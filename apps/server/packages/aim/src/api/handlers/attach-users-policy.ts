import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import ManagedUser from '@aim/models/managed-user';
import PermissionPolicy from '@aim/models/permission-policy';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string[], null> = (resource) => {
  if (resource.length < 2) return false;

  const userFrns = resource.slice(0, -1);
  const policyFrn = resource[resource.length - 1];

  if (!userFrns.length || !policyFrn) return false;

  return (
    userFrns.every((frn) =>
      validateFRNForServiceAndResourceType(frn, 'aim', 'user'),
    ) && validateFRNForServiceAndResourceType(policyFrn, 'aim', 'policy')
  );
};

const handlerWithoutDeps =
  (
    permissionPolicyModel: Model<IPermissionPolicy>,
    managedUserModel: Model<IManagedUser>,
  ): HandlerFunction<string[], null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const userFrns = resource.slice(0, -1);
    const policyFrn = resource[resource.length - 1];
    const userAliases = userFrns.map((frn) => parseFRN(frn).resourceId);
    const policyAlias = parseFRN(policyFrn).resourceId;

    const users = await managedUserModel.find({
      account: accountId,
      alias: { $in: userAliases },
    });
    if (users.length !== userAliases.length) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'One or more users not found',
      );
    }

    const policy = await permissionPolicyModel.findOne({
      account: accountId,
      alias: policyAlias,
    });
    if (!policy) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Policy not found',
      );
    }

    await managedUserModel.updateMany(
      { account: accountId, alias: { $in: userAliases } },
      { $addToSet: { policies: policy._id } },
    );
  };

const handler = handlerWithoutDeps(PermissionPolicy, ManagedUser);

export const name = 'AttachUsersPolicy';
export default handler;
