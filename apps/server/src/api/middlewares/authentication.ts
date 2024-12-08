import * as e from 'express';
import { AppError, CommonErrors } from '../../utils/errors';
import { AuthService } from '../../services/auth';
import Account from '../../models/account';
import { publisher } from '../../events';
import ManagedUser from '@aim/models/managed-user';
import RefreshTokenModel from '@/models/refresh-token';
import { IAccessKey } from '@sharedtypes/aim/access-key';
import AimAccessKey from '@aim/models/access-key';
import { Model } from 'mongoose';
import { IAccount } from '@sharedtypes/auth/account';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { decryptUsingAES } from '@/utils/crypto';
import { env } from '@/config';

if (!env.aim.access_key_secret_encryption_key) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    `AIM: Access key secret encryption key not found`,
    true,
  );
}

if (!env.aim.fws_access_key_header) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    `AIM: FWS access key header not found`,
    true,
  );
}

if (!env.aim.fws_signature_header) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    `AIM: FWS signature header not found`,
    true,
  );
}

const FWS_ACCESS_KEY_HEADER = env.aim.fws_access_key_header;
const FWS_SIGNATURE_HEADER = env.aim.fws_signature_header;

export class AuthMiddleware {
  private readonly authService: AuthService;
  private readonly accessKeyModel: Model<IAccessKey>;
  private readonly accountModel: Model<IAccount>;
  private readonly managedUserModel: Model<IManagedUser>;

  constructor() {
    this.authService = new AuthService(
      Account,
      ManagedUser,
      RefreshTokenModel,
      publisher,
    );
    this.accessKeyModel = AimAccessKey;
    this.accountModel = Account;
    this.managedUserModel = ManagedUser;
  }

  public async requireAuthenticated(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      // AIM Access Key authentication
      const accessKeyId = req.headers[FWS_ACCESS_KEY_HEADER];
      if (accessKeyId) {
        const signature = req.headers[FWS_SIGNATURE_HEADER] as string;
        if (!signature || typeof signature !== 'string') {
          throw new AppError(
            CommonErrors.Unauthorized.name,
            CommonErrors.Unauthorized.statusCode,
            'Invalid signature',
          );
        }

        const accessKey = await this.accessKeyModel
          .findById(accessKeyId)
          .select('+token');
        if (!accessKey) {
          throw new AppError(
            CommonErrors.Unauthorized.name,
            CommonErrors.Unauthorized.statusCode,
            'Invalid access key',
          );
        }

        const { token, user: managedUserId } = accessKey;
        const managedUser = await this.managedUserModel.findById(managedUserId);
        if (!managedUser) {
          throw new AppError(
            CommonErrors.Unauthorized.name,
            CommonErrors.Unauthorized.statusCode,
            'Invalid access key',
          );
        }

        const secret = decryptUsingAES(
          token as string,
          env.aim.access_key_secret_encryption_key as string,
        );
        const isSignatureValid = await this.authService.verifyRequestSignature(
          secret,
          signature,
          req,
        );
        if (!isSignatureValid) {
          throw new AppError(
            CommonErrors.Unauthorized.name,
            CommonErrors.Unauthorized.statusCode,
            'Invalid signature',
          );
        }

        const payload = await this.authService.generatePayload({
          type: 'fws-user',
          account: { _id: managedUser.account as string },
          user: managedUser,
        });
        req.user = payload;

        return next();
      }

      // Normal authentication
      // Get the token from the Authorization header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new AppError(
          CommonErrors.Unauthorized.name,
          CommonErrors.Unauthorized.statusCode,
          'Invalid access token',
        );
      }

      const payload = await this.authService.verifyAccessToken(token);
      req.user = payload;

      next();
    } catch (err) {
      next(err);
    }
  }

  public async requireMFAVerified(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    const { mfaVerified } = req.user;

    const token = this.authService.generate2FAAccessToken(req.user);

    if (!mfaVerified) {
      return res.status(CommonErrors.Unauthorized.statusCode).json({
        requires2FA: true,
        token,
      });
    }

    next();
  }
}
