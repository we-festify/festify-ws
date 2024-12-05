import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { hashPassword } from '@/utils/password';
import ManagedUser from '@aim/models/managed-user';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, unknown> = (_, data) => {
  const dataSchema = Joi.object().keys({
    user: Joi.object().keys({
      alias: Joi.string().required(),
      password: Joi.string().required(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return !dataError;
};

const handlerWithoutDeps =
  (
    managedUserModel: Model<IManagedUser>,
  ): HandlerFunction<
    null,
    {
      user: {
        alias: string;
        password: string;
      };
    }
  > =>
  async (_resource, data, context) => {
    const { accountId } = context.user;
    const { user } = data;

    const existingUser = await managedUserModel.findOne({
      account: accountId,
      alias: user.alias,
    });
    if (existingUser) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'Managed user with this alias already exists',
      );
    }

    const passwordHash = await hashPassword(user.password);

    await managedUserModel.create({
      alias: user.alias,
      passwordHash,
      account: accountId,
    });
  };

const handler = handlerWithoutDeps(ManagedUser);

export const name = 'CreateManagedUser';
export default handler;
