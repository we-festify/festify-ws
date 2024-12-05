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

  const userFrn = resource[0];
  const policyFrns = resource.slice(1);

  if (!userFrn || !policyFrns.length) return false;

  return (
    validateFRNForServiceAndResourceType(userFrn, 'aim', 'user') &&
    policyFrns.every((frn) =>
      validateFRNForServiceAndResourceType(frn, 'aim', 'policy'),
    )
  );
};

const handlerWithoutDeps =
  (
    permissionPolicyModel: Model<IPermissionPolicy>,
    managedUserModel: Model<IManagedUser>,
  ): HandlerFunction<string[], null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const userFrn = resource[0];
    const policyFrns = resource.slice(1);
    const userAlias = parseFRN(userFrn).resourceId;
    const policyAliases = policyFrns.map((frn) => parseFRN(frn).resourceId);

    const user = await managedUserModel.findOne({
      accountId,
      alias: userAlias,
    });
    if (!user) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'User not found',
      );
    }

    const policies = await permissionPolicyModel.find({
      accountId,
      alias: { $in: policyAliases },
    });
    if (policies.length !== policyAliases.length) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'One or more policies not found',
      );
    }

    await managedUserModel.updateOne(
      { accountId, alias: userAlias },
      {
        $addToSet: {
          policies: { $each: policies.map((policy) => policy._id) },
        },
      },
    );
  };

const handler = handlerWithoutDeps(PermissionPolicy, ManagedUser);

export const name = 'AttachUserPolicies';
export default handler;
