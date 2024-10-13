import { Model } from 'mongoose';
import { IBESInstance } from '@sharedtypes/bes/instance';
import { AppError, CommonErrors } from '@/utils/errors';
import { encryptUsingAES } from '@/utils/crypto';
import { env } from '@/config';

export class InstanceService {
  private readonly instanceModel: Model<IBESInstance>;

  constructor(instanceModel: Model<IBESInstance>) {
    this.instanceModel = instanceModel;
  }

  public async getInstancesByAccount(accountId: string) {
    return this.instanceModel.find({
      account: accountId,
    });
  }

  public async getInstanceById(instanceId: string, accountId: string) {
    return this.instanceModel.findOne({
      account: accountId,
      _id: instanceId,
    });
  }

  public async getInstanceByAlias(alias: string, accountId: string) {
    return this.instanceModel.findOne({
      account: accountId,
      alias,
    });
  }

  public async createInstance(instance: IBESInstance, accountId: string) {
    const existingInstance = await this.instanceModel.findOne({
      account: accountId,
      alias: instance.alias,
    });
    if (existingInstance) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'Instance already exists',
      );
    }

    const senderPasswordEncryptionKey = env.bes.sender_password_secret;
    if (!senderPasswordEncryptionKey) {
      throw new AppError(
        CommonErrors.InternalServerError.name,
        CommonErrors.InternalServerError.statusCode,
        'Sender password encryption key not found',
        true,
      );
    }
    instance.senderPassword = encryptUsingAES(
      instance.senderPassword,
      senderPasswordEncryptionKey,
    );

    return this.instanceModel.create({
      ...instance,
      account: accountId,
    });
  }

  public async updateInstanceById(
    instanceId: string,
    instance: IBESInstance,
    accountId: string,
  ) {
    const existingInstance = await this.instanceModel.findOne({
      account: accountId,
      _id: instanceId,
    });
    if (!existingInstance) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Instance not found',
      );
    }

    return this.instanceModel.updateOne(
      {
        account: accountId,
        _id: instance._id,
      },
      instance,
    );
  }

  public async deleteOneOrManyInstances(
    instanceIds: string | string[],
    accountId: string,
  ) {
    return this.instanceModel.deleteMany({
      account: accountId,
      _id: { $in: Array.isArray(instanceIds) ? instanceIds : [instanceIds] },
    });
  }
}
