import { env } from '@/config';
import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { encryptUsingAES, generateRandomString } from '@/utils/crypto';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import AimAccessKey from '@aim/models/access-key';
import ManagedUser from '@aim/models/managed-user';
import { IAccessKey } from '@sharedtypes/aim/access-key';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { Model } from 'mongoose';

if (!env.aim.access_key_secret_encryption_key) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    `AIM: Access key secret encryption key not found`,
    true,
  );
}

export const validator: ValidatorFunction<string, null> = (resource) => {
  return validateFRNForServiceAndResourceType(resource, 'aim', 'user');
};

const handlerWithoutDeps =
  (
    managedUserModel: Model<IManagedUser>,
    accessKeyModel: Model<IAccessKey>,
  ): HandlerFunction<string, null> =>
  async (resource, _, context) => {
    const { accountId } = context.user;
    const { resourceId: alias } = parseFRN(resource);

    const foundManagedUser = await managedUserModel.findOne({
      account: accountId,
      alias,
    });
    if (!foundManagedUser) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        `Managed user not found`,
      );
    }

    const foundAccessKey = await accessKeyModel.findOne({
      user: foundManagedUser._id,
    });
    if (!foundAccessKey) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        `Access key not found for user`,
      );
    }

    const accessKeySecret = generateRandomString(32);
    const encryptedSecret = encryptUsingAES(
      accessKeySecret,
      env.aim.access_key_secret_encryption_key as string,
    );
    const oneYearInMs = 1000 * 60 * 60 * 24 * 365;

    foundAccessKey.token = encryptedSecret;
    foundAccessKey.expiresAt = new Date(Date.now() + oneYearInMs);
    await foundAccessKey.save();

    return { secret: accessKeySecret };
  };

const handler = handlerWithoutDeps(ManagedUser, AimAccessKey);

export const name = 'RotateAccessKey';
export default handler;