import bcrypt from 'bcrypt';
import { AppError, CommonErrors } from '@/utils/errors';
import { CreateUserDTO, UpdateUserDTO } from '@aim/types/services/user';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { Model } from 'mongoose';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';

export class ManagedUserService {
  private readonly userModel: Model<IManagedUser>;
  private readonly policyModel: Model<IPermissionPolicy>;

  constructor(
    userModel: Model<IManagedUser>,
    policyModel: Model<IPermissionPolicy>,
  ) {
    this.userModel = userModel;
    this.policyModel = policyModel;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async excludeSensitiveFields(
    userObj: IManagedUser,
  ): Promise<IManagedUser> {
    delete userObj.passwordHash;
    delete userObj.policies;
    return userObj;
  }

  public async getUsersByAccountId(accountId: string): Promise<IManagedUser[]> {
    const users = await this.userModel.find({ rootAccount: accountId });
    return Promise.all(
      users.map((user) => this.excludeSensitiveFields(user.toObject())),
    );
  }

  public async getUserById(userId: string): Promise<IManagedUser> {
    if (!userId) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'User ID is required',
      );
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'User not found',
      );
    }

    return this.excludeSensitiveFields(user.toObject());
  }

  public async createUser(
    createUserDto: CreateUserDTO,
    createUserConfig: { accountId: string },
  ): Promise<IManagedUser> {
    const { alias, password } = createUserDto;

    const existingUser = await this.userModel.findOne({
      alias,
      rootAccount: createUserConfig.accountId,
    });
    if (existingUser) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'User with this alias already exists',
      );
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = new this.userModel({
      alias,
      passwordHash: hashedPassword,
      rootAccount: createUserConfig.accountId,
    });
    return this.excludeSensitiveFields(await newUser.save());
  }

  /**
   * Note: This method does not update the password hash, policies, or root account
   */
  public async updateUser(
    userId: string,
    updateUserDto: UpdateUserDTO,
    updateUserConfig: { accountId: string },
  ): Promise<IManagedUser> {
    const user = await this.userModel.findOne({
      _id: userId,
      rootAccount: updateUserConfig.accountId,
    });
    if (!user) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'User not found',
      );
    }

    if (updateUserDto.alias) {
      const existingUser = await this.userModel.findOne({
        alias: updateUserDto.alias,
        rootAccount: user.rootAccount,
      });
      if (existingUser) {
        throw new AppError(
          CommonErrors.Conflict.name,
          CommonErrors.Conflict.statusCode,
          'User with this alias already exists',
        );
      }
    }

    if (updateUserDto.password) {
      user.passwordHash = await this.hashPassword(updateUserDto.password);
    }

    if (updateUserDto.alias) {
      user.alias = updateUserDto.alias;
    }

    return this.excludeSensitiveFields(await user.save());
  }

  public async deleteOneOrManyUsers(
    userIds: string | string[],
    accountId: string,
  ): Promise<void> {
    await this.userModel.deleteMany({
      _id: { $in: userIds },
      rootAccount: accountId,
    });
  }

  public async attachPoliciesToUser(
    userId: string,
    policyIds: string[],
    accountId: string,
  ): Promise<void> {
    const user = await this.userModel.findOne({
      _id: userId,
      rootAccount: accountId,
    });
    if (!user) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'User not found',
      );
    }

    const policies = await this.policyModel.find({
      _id: { $in: policyIds },
      account: accountId,
    });
    if (policies.length !== policyIds.length) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'One or more policies not found',
      );
    }

    await this.userModel.updateOne(
      { _id: userId, rootAccount: accountId },
      { $addToSet: { policies: { $each: policyIds } } },
    );
  }

  public async detachPoliciesFromUser(
    userId: string,
    policyIds: string[],
    accountId: string,
  ): Promise<void> {
    if (!userId) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'User ID is required',
      );
    }

    const user = await this.userModel.findOne({
      _id: userId,
      rootAccount: accountId,
    });
    if (!user) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'User not found',
      );
    }

    const policies = await this.policyModel.find({
      _id: { $in: policyIds },
      account: accountId,
    });
    if (policies.length !== policyIds.length) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'One or more policies not found',
      );
    }

    await this.userModel.updateOne(
      { _id: userId, rootAccount: accountId },
      { $pullAll: { policies: policyIds } },
    );
  }
}
