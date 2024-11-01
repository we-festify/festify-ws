import { Model } from 'mongoose';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import { AppError, CommonErrors } from '@/utils/errors';
import { IManagedUser } from '@sharedtypes/aim/managed-user';

export class PermissionService {
  private readonly permissionPolicyModel: Model<IPermissionPolicy>;
  private readonly userModel: Model<IManagedUser>;

  constructor(
    permissionPolicyModel: Model<IPermissionPolicy>,
    userModel: Model<IManagedUser>,
  ) {
    this.permissionPolicyModel = permissionPolicyModel;
    this.userModel = userModel;
  }

  public async getPoliciesByAccountId(
    accountId: string,
  ): Promise<IPermissionPolicy[]> {
    if (!accountId) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Account ID is required',
      );
    }
    return this.permissionPolicyModel.find({ account: accountId });
  }

  public async getPolicyById(
    policyId: string,
    accountId: string,
  ): Promise<IPermissionPolicy> {
    if (!policyId) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Policy ID is required',
      );
    }

    const policy = await this.permissionPolicyModel
      .findOne({
        _id: policyId,
        account: accountId,
      })
      .select('+rules');
    if (!policy) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Policy not found',
      );
    }

    return policy;
  }

  public async createPolicy(
    policy: IPermissionPolicy,
    accountId: string,
  ): Promise<IPermissionPolicy> {
    if (!policy) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Policy is required',
      );
    }

    const existingPolicy = await this.permissionPolicyModel.findOne({
      alias: policy.alias,
      account: accountId,
    });
    if (existingPolicy) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'Policy with this alias already exists',
      );
    }

    const newPolicy = new this.permissionPolicyModel({
      ...policy,
      account: accountId,
    });
    return newPolicy.save();
  }

  public async updatePolicy(
    policyId: string,
    policy: IPermissionPolicy,
    accountId: string,
  ): Promise<IPermissionPolicy> {
    if (!policyId) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Policy ID is required',
      );
    }

    const existingPolicy = await this.permissionPolicyModel.findOne({
      _id: policyId,
      account: accountId,
    });
    if (!existingPolicy) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Policy not found',
      );
    }

    const updatedPolicy = await this.permissionPolicyModel
      .findOneAndUpdate(
        { _id: policyId, account: accountId },
        { ...policy },
        { new: true },
      )
      .select('+rules');
    if (!updatedPolicy) {
      throw new AppError(
        CommonErrors.InternalServerError.name,
        CommonErrors.InternalServerError.statusCode,
        'Failed to update policy',
      );
    }

    return updatedPolicy;
  }

  public async deleteOneOrManyPolicies(
    policyIds: string | string[],
    accountId: string,
  ): Promise<void> {
    if (!policyIds) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Policy IDs are required',
      );
    }

    await this.permissionPolicyModel.deleteMany({
      _id: { $in: Array.isArray(policyIds) ? policyIds : [policyIds] },
      account: accountId,
    });
  }

  public async attachUsersToPolicy(
    policyId: string,
    userIds: string[],
    accountId: string,
  ): Promise<void> {
    if (!policyId) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Policy ID is required',
      );
    }

    const policy = await this.permissionPolicyModel.findOne({
      _id: policyId,
      account: accountId,
    });
    if (!policy) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Policy not found',
      );
    }

    const users = await this.userModel.find({
      _id: { $in: userIds },
      rootAccount: accountId,
    });
    if (users.length !== userIds.length) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'One or more users not found',
      );
    }

    await Promise.all(
      userIds.map((userId) =>
        this.userModel.updateOne(
          { _id: userId, rootAccount: accountId },
          { $addToSet: { policies: policyId } },
        ),
      ),
    );
  }

  public async detachUsersFromPolicy(
    policyId: string,
    userIds: string[],
    accountId: string,
  ): Promise<void> {
    if (!policyId) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Policy ID is required',
      );
    }

    const policy = await this.permissionPolicyModel.findOne({
      _id: policyId,
      account: accountId,
    });
    if (!policy) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Policy not found',
      );
    }

    await Promise.all(
      userIds.map((userId) =>
        this.userModel.updateOne(
          { _id: userId, rootAccount: accountId },
          { $pull: { policies: policyId } },
        ),
      ),
    );
  }
}
