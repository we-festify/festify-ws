import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import PermissionPolicy from '@aim/models/permission-policy';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string[], null> = (resource) => {
  return resource.every((r) =>
    validateFRNForServiceAndResourceType(r, 'aim', 'policy'),
  );
};

const handlerWithoutDeps =
  (
    permissionPolicyModel: Model<IPermissionPolicy>,
  ): HandlerFunction<string[], null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const aliases = resource.map((frn) => parseFRN(frn).resourceId);

    await permissionPolicyModel.deleteMany({
      account: accountId,
      alias: { $in: aliases },
    });
  };

const handler = handlerWithoutDeps(PermissionPolicy);

export const name = 'DeletePolicies';
export default handler;
