import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN } from '@/utils/frn';
import { executePermissionPolicyRule } from '@aim/utils/policy';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import {
  IPermissionPolicy,
  PermissionPolicyAction,
  PermissionPolicyResource,
} from '@sharedtypes/aim/permission-policy';
import * as e from 'express';
import { Model } from 'mongoose';

export class AuthZMiddleware {
  private readonly managedUserModel: Model<IManagedUser>;
  private readonly permissionPolicyModel: Model<IPermissionPolicy>;

  constructor(
    managedUserModel: Model<IManagedUser>,
    permissionPolicyModel: Model<IPermissionPolicy>,
  ) {
    this.managedUserModel = managedUserModel;
    this.permissionPolicyModel = permissionPolicyModel;
  }

  public canExecuteActionOnResource(action: PermissionPolicyAction) {
    return async (req: e.Request, _res: e.Response, next: e.NextFunction) => {
      const user = req.user;
      if (!user) {
        return next(
          new AppError(
            CommonErrors.Forbidden.name,
            CommonErrors.Forbidden.statusCode,
            'Forbidden',
          ),
        );
      }

      let { resource } = req.body as {
        resource:
          | PermissionPolicyResource
          | PermissionPolicyResource[]
          | undefined;
      };
      if (!Array.isArray(resource))
        resource = [resource].filter(Boolean) as PermissionPolicyResource[];

      const { accountId } = user;
      // for each resource, check if the accountId is in the FRN
      for (const res of resource) {
        const { accountId: requestedAccountId } = parseFRN(res);
        if (requestedAccountId !== accountId && requestedAccountId !== '') {
          return next(
            new AppError(
              CommonErrors.Forbidden.name,
              CommonErrors.Forbidden.statusCode,
              'Forbidden',
            ),
          );
        }
      }

      // At this point, the root user is authorized to execute the action on the resource
      if (user.type === 'fws-root') return next();

      const managedUser = await this.managedUserModel
        .findOne({
          account: accountId,
          alias: user.alias,
        })
        .select('policies');
      if (!managedUser) {
        return next(
          new AppError(
            CommonErrors.Forbidden.name,
            CommonErrors.Forbidden.statusCode,
            'Forbidden',
          ),
        );
      }

      const policies = await this.permissionPolicyModel
        .find({
          account: accountId,
          _id: { $in: managedUser.policies },
        })
        .select('rules');
      const rules = policies.flatMap((p) => p.rules?.filter(Boolean) ?? []);

      const canExecute = rules.some((rule) =>
        executePermissionPolicyRule(rule, action, resource),
      );

      if (!canExecute) {
        return next(
          new AppError(
            CommonErrors.Forbidden.name,
            CommonErrors.Forbidden.statusCode,
            'Forbidden',
          ),
        );
      }

      return next();
    };
  }
}
