import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import { hashPassword } from '@/utils/password';
import ManagedUser from '@aim/models/managed-user';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, unknown> = (
  resource,
  data,
) => {
  const isValidResource = validateFRNForServiceAndResourceType(
    resource,
    'aim',
    'user',
  );

  const dataSchema = Joi.object().keys({
    user: Joi.object().keys({
      alias: Joi.string(),
      password: Joi.string(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

const handlerWithoutDeps =
  (
    managedUserModel: Model<IManagedUser>,
  ): HandlerFunction<
    string,
    {
      user: {
        alias: string;
        password: string;
      };
    }
  > =>
  async (resource, data, context) => {
    const { accountId } = context.user;
    const { user } = data;
    const { resourceId: alias } = parseFRN(resource);

    const foundManagedUser = await managedUserModel.findOne({
      account: accountId,
      alias,
    });
    if (!foundManagedUser) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Managed user not found',
      );
    }

    // check if alias is already taken
    const existingUser = await managedUserModel.findOne({
      account: accountId,
      alias: user.alias,
    });
    if (
      existingUser &&
      existingUser?._id.toString() !== foundManagedUser._id.toString()
    ) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'Managed user with this alias already exists',
      );
    }

    // if password is provided, hash it
    let passwordHash = foundManagedUser.passwordHash;
    if (user.password) {
      passwordHash = await hashPassword(user.password);
    }

    await managedUserModel.updateOne(
      {
        account: accountId,
        alias,
      },
      {
        alias: user.alias,
        passwordHash,
      },
    );
  };

const handler = handlerWithoutDeps(ManagedUser);

export const name = 'UpdateManagedUser';
export default handler;
