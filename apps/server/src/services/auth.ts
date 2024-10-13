import { Model } from 'mongoose';
import {
  IRefreshToken,
  IAccount,
  IBackupCode,
} from '@sharedtypes/auth/account';
import { IDeviceInfo } from '../types/middlewares/user-agent';
import bcrypt from 'bcrypt';
import { AppError, CommonErrors } from '../utils/errors';
import jwt from 'jsonwebtoken';
import { env, meta } from '../config';
import crypto from 'crypto';
import { EventsPublisher } from '../events';
import {
  AccountChooser,
  Disable2FAConfig,
  Disable2FADTO,
  Enable2FAConfig,
  Enable2FADTO,
  RegenerateRecoveryCodesDTO,
  RequestPasswordResetDTO,
  ResetPasswordConfig,
  ResetPasswordDTO,
  Setup2FAAuthenticatorDTO,
  TokenPayload,
  UpdateRecoveryEmailDTO,
  RootUserLoginConfig,
  RootUserLoginDTO,
  RootUserLoginResponse,
  RootUserOTPLoginDTO,
  RootUserRecoveryCodeLoginDTO,
  UserRefreshTokensConfig,
  RootUserRegisterDTO,
  RootUserRegisterResponse,
  RootAccountTokenPayload,
  ManagedUserTokenPayload,
} from '../types/services/auth.d';
import { authenticator } from 'otplib';
import { IManagedUser } from '@sharedtypes/auth/user';
import {
  convertToSHA256,
  decryptUsingAES,
  encryptUsingAES,
} from '@/utils/crypto';

export class AuthService {
  private readonly accountModel: Model<IAccount>;
  private readonly publisher: EventsPublisher;

  constructor(accountModel: Model<IAccount>, publisher: EventsPublisher) {
    this.accountModel = accountModel;
    this.publisher = publisher;
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private async generatePayload(
    {
      type,
      user,
      account,
    }: {
      type: string;
      user: Partial<IManagedUser>;
      account: Partial<IAccount>;
    },
    mfaVerified = false,
  ): Promise<TokenPayload> {
    return type === 'fws-root'
      ? ({
          email: account.email,
          accountId: account._id,
          type: 'fws-root',
          mfaVerified,
        } as RootAccountTokenPayload)
      : ({
          alias: user.alias,
          accountId: account._id,
          type: 'fws-user',
        } as ManagedUserTokenPayload);
  }

  private async generateAccessToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, env.auth.accessTokenSecret, {
      expiresIn: env.auth.accessTokenExpiresInSeconds,
    });
  }

  private async generateRefreshToken(
    payload: TokenPayload,
    deviceInfo: IDeviceInfo,
  ): Promise<{
    token: string;
    expires: Date;
    deviceInfo?: IDeviceInfo;
  }> {
    const uniquePayloadString = JSON.stringify(payload) + Date.now();
    const token = crypto
      .createHash('sha256')
      .update(uniquePayloadString)
      .digest('hex');
    const expires = new Date(
      Date.now() + env.auth.refreshTokenExpiresInSeconds * 1000,
    );

    return { token, expires, deviceInfo };
  }

  private async generateRandomOTP(length = 6): Promise<string> {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      otp += digits.charAt(randomIndex);
    }

    return otp;
  }

  private async filterExpiredRefreshTokens(
    refreshTokens: IRefreshToken[],
  ): Promise<IRefreshToken[]> {
    return refreshTokens.filter((rt) => rt.expires > new Date());
  }

  private excludeAccountSensitiveFields(
    account: Partial<IAccount>,
  ): Partial<IAccount> {
    // Sensitive fields
    delete account.passwordHash;
    delete account.emailVerificationToken;
    delete account.emailVerificationTokenExpires;
    delete account.resetPasswordToken;
    delete account.resetPasswordTokenExpires;
    delete account.refreshTokens;

    // 2FA sensitive fields
    if (account.twoFactorAuth?.otp) {
      account.twoFactorAuth.otp.hash = undefined;
      account.twoFactorAuth.otp.expires = undefined;
    }
    if (account.twoFactorAuth?.totp) {
      account.twoFactorAuth.totp.secret = undefined;
    }
    // Recovery details
    if (account.recoveryDetails) {
      account.recoveryDetails.backupCodesUsedCount =
        account.recoveryDetails.backupCodes.filter(
          (code) => code.usedAt,
        ).length;
      account.recoveryDetails.backupCodes = [];
    }
    return account;
  }

  private async encodeRefreshToken(
    refreshToken: IRefreshToken,
  ): Promise<string> {
    // Encode the refresh token just to make it easy to store
    // No need to encrypt as it won't add any more security
    return Buffer.from(JSON.stringify(refreshToken)).toString('base64');
  }

  private async decodeRefreshToken(token: string): Promise<IRefreshToken> {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  }

  private checkSameDevice(
    deviceInfo: IDeviceInfo,
    refreshToken: IRefreshToken,
  ): boolean {
    return (
      (refreshToken.deviceInfo &&
        deviceInfo.browser === refreshToken.deviceInfo.browser &&
        deviceInfo.os === refreshToken.deviceInfo.os &&
        deviceInfo.platform === refreshToken.deviceInfo.platform &&
        deviceInfo.source === refreshToken.deviceInfo.source) ||
      false
    );
  }

  private generateResetPasswordToken(payload: TokenPayload): string {
    return convertToSHA256(JSON.stringify(payload) + Date.now());
  }

  private generateEmailVerificationToken(payload: TokenPayload): string {
    return convertToSHA256(JSON.stringify(payload) + Date.now());
  }

  private async verify2FAToken(token: string): Promise<TokenPayload> {
    try {
      const payload = jwt.verify(token, env.twoFactorAuth.tokenSecret);
      return payload as TokenPayload;
    } catch (_err) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Invalid or expired 2FA token. Please login again.',
      );
    }
  }

  private async encrypt2FATOTPSecret(secret: string): Promise<string> {
    const key = env.twoFactorAuth.totp.encryptionSecret;
    if (!key) {
      throw new AppError(
        CommonErrors.InternalServerError.name,
        CommonErrors.InternalServerError.statusCode,
        'Encryption secret for 2FA TOTP not found',
        false,
      );
    }
    return encryptUsingAES(secret, key);
  }

  private async decrypt2FATOTPSecret(encryptedSecret: string): Promise<string> {
    const key = env.twoFactorAuth.totp.encryptionSecret;
    if (!key) {
      throw new AppError(
        CommonErrors.InternalServerError.name,
        CommonErrors.InternalServerError.statusCode,
        'Encryption secret for 2FA TOTP not found',
        false,
      );
    }
    return decryptUsingAES(encryptedSecret, key);
  }

  private async generateRecoveryEmailVerificationToken(
    payload: TokenPayload & { recoveryEmail: string },
  ): Promise<string> {
    return jwt.sign(payload, env.auth.recoveryEmailVerificationTokenSecret, {
      expiresIn: env.auth.recoveryEmailVerificationTokenExpiresInSeconds,
    });
  }

  private async verifyRecoveryEmailVerificationToken(
    token: string,
  ): Promise<TokenPayload & { recoveryEmail: string }> {
    try {
      const payload = jwt.verify(
        token,
        env.auth.recoveryEmailVerificationTokenSecret,
      );
      return payload as TokenPayload & { recoveryEmail: string };
    } catch (_err) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Invalid or expired recovery email verification token',
      );
    }
  }

  private async encryptBackupCode(code: string): Promise<string> {
    const key = env.auth.backupCodeEncryptionSecret;
    if (!key) {
      throw new AppError(
        CommonErrors.InternalServerError.name,
        CommonErrors.InternalServerError.statusCode,
        'Encryption secret for backup code not found',
        false,
      );
    }
    return encryptUsingAES(code, key);
  }

  private async decryptBackupCode(encryptedCode: string): Promise<string> {
    const key = env.auth.backupCodeEncryptionSecret;
    if (!key) {
      throw new AppError(
        CommonErrors.InternalServerError.name,
        CommonErrors.InternalServerError.statusCode,
        'Encryption secret for backup code not found',
        false,
      );
    }
    return decryptUsingAES(encryptedCode, key);
  }

  private async generateBackupCodes(): Promise<string[]> {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      // 8 characters long
      const code = crypto.randomBytes(4).toString('hex');
      const encryptedCode = await this.encryptBackupCode(code);
      codes.push(encryptedCode);
    }
    return codes;
  }

  public async generate2FAAccessToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, env.twoFactorAuth.tokenSecret, {
      expiresIn: env.twoFactorAuth.tokenExpiresInSeconds,
    });
  }

  public async getRootAccount(accountId: string): Promise<Partial<IAccount>> {
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }
    return this.excludeAccountSensitiveFields(account.toObject());
  }

  public async getManagedUserDetails(
    alias: string,
    accountId: string,
  ): Promise<Partial<IManagedUser>> {
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    return {}; // return managed user details
  }

  public async register(
    registerDTO: RootUserRegisterDTO,
  ): Promise<RootUserRegisterResponse> {
    const existingAccount = await this.accountModel.findOne({
      email: registerDTO.email,
    });
    if (existingAccount) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'account with this email already exists. Please login instead.',
      );
    }

    const hashedPassword = await this.hashPassword(registerDTO.password);
    const createdAccount = new this.accountModel({
      ...registerDTO,
      password: undefined,
      passwordHash: hashedPassword,
      role: 'account',
    });

    const payload = await this.generatePayload({
      type: 'fws-root',
      user: {},
      account: { email: registerDTO.email },
    });
    createdAccount.emailVerificationToken =
      this.generateEmailVerificationToken(payload);
    createdAccount.emailVerificationTokenExpires = new Date(
      Date.now() + env.auth.emailVerificationTokenExpiresInSeconds * 1000,
    );
    await createdAccount.save();

    const account = this.excludeAccountSensitiveFields(
      createdAccount.toObject(),
    );

    // Publish events
    this.publisher.auth.publishRootUserEmailVerificationRequestedEvent({
      account: { alias: account.alias ?? '', email: account.email ?? '' },
      emailVerificationToken: createdAccount.emailVerificationToken,
    });
    this.publisher.auth.publishRootUserRegisteredEvent({
      account: { alias: account.alias ?? '', email: account.email ?? '' },
    });

    return { account };
  }

  public async verifyEmail(token: string): Promise<void> {
    const existingAccount = await this.accountModel
      .findOne({
        emailVerificationToken: token,
      })
      .select('+emailVerificationToken +emailVerificationTokenExpires');

    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Invalid or expired email verification token',
      );
    }

    if (
      !existingAccount.emailVerificationTokenExpires ||
      existingAccount.emailVerificationTokenExpires < new Date()
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Email verification token expired. Please request a new one by logging in.',
      );
    }

    existingAccount.emailVerificationToken = undefined;
    existingAccount.emailVerificationTokenExpires = undefined;
    existingAccount.isEmailVerified = true;
    await existingAccount.save();
  }

  public async resendEmailVerification(email: string): Promise<void> {
    const existingAccount = await this.accountModel
      .findOne({ email })
      .select('+emailVerificationToken +emailVerificationTokenExpires');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (existingAccount.isEmailVerified) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Email already verified',
      );
    }

    if (
      existingAccount.emailVerificationTokenExpires &&
      existingAccount.emailVerificationTokenExpires > new Date()
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Email verification token already sent.',
      );
    }

    const payload = await this.generatePayload({
      type: 'fws-root',
      user: {},
      account: { email },
    });
    existingAccount.emailVerificationToken =
      this.generateEmailVerificationToken(payload);
    existingAccount.emailVerificationTokenExpires = new Date(
      Date.now() + env.auth.emailVerificationTokenExpiresInSeconds * 1000,
    );
    await existingAccount.save();

    const account = this.excludeAccountSensitiveFields(
      existingAccount.toObject(),
    );

    // Publish events
    this.publisher.auth.publishRootUserEmailVerificationRequestedEvent({
      account: {
        alias: account.alias ?? '',
        email: account.email ?? '',
      },
      emailVerificationToken: existingAccount.emailVerificationToken,
    });
  }

  public async loginRootWithEmailAndPassword(
    userDTO: RootUserLoginDTO,
    config: RootUserLoginConfig,
  ): Promise<RootUserLoginResponse> {
    const existingAccount = await this.accountModel
      .findOne({ email: userDTO.email })
      .select('+passwordHash +refreshTokens +twoFactorAuth');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    const passwordsMatch = await this.comparePasswords(
      userDTO.password,
      existingAccount.passwordHash || '',
    );
    if (!passwordsMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Incorrect password',
      );
    }

    if (!existingAccount.isEmailVerified) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Email not verified. If you did not receive the verification email, please request a new one.',
      );
    }

    // Filter expired refresh tokens
    existingAccount.refreshTokens = await this.filterExpiredRefreshTokens(
      existingAccount.refreshTokens || [],
    );
    // Check if device already present
    const existingRefreshToken = existingAccount.refreshTokens?.find(
      (rt: IRefreshToken) => this.checkSameDevice(config.deviceInfo, rt),
    );
    if (existingRefreshToken) {
      const payload = await this.generatePayload({
        type: 'fws-root',
        user: {},
        account: existingAccount,
      });
      const accessToken = await this.generateAccessToken(payload);
      const encodedRefreshToken =
        await this.encodeRefreshToken(existingRefreshToken);

      const accountObject = this.excludeAccountSensitiveFields(
        existingAccount.toObject(),
      );
      return {
        type: 'fws-root',
        account: accountObject,
        accessToken,
        refreshToken: encodedRefreshToken,
      };
    }

    // if 2FA is enabled
    // send a short access token to be used for getting account's details
    if (existingAccount.twoFactorAuth?.enabled) {
      const payload = await this.generatePayload({
        type: 'fws-root',
        user: {},
        account: existingAccount,
      });
      const token = await this.generate2FAAccessToken(payload);
      return { requires2FA: true, token };
    }

    const payload = await this.generatePayload({
      type: 'fws-root',
      user: {},
      account: existingAccount,
    });
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(
      payload,
      config.deviceInfo,
    );

    existingAccount.refreshTokens.push(refreshToken);
    await existingAccount.save();

    const accountObject = this.excludeAccountSensitiveFields(
      existingAccount.toObject(),
    );

    // Publish events
    this.publisher.auth.publishRootUserLoggedInEvent({
      account: {
        alias: accountObject.alias ?? '',
        email: accountObject.email ?? '',
      },
      deviceInfo: config.deviceInfo,
    });

    const encodedRefreshToken = await this.encodeRefreshToken(refreshToken);
    return {
      type: 'fws-root',
      account: accountObject,
      accessToken,
      refreshToken: encodedRefreshToken,
    };
  }

  public async logout(refreshToken: string): Promise<void> {
    const decodedRefreshToken = await this.decodeRefreshToken(refreshToken);
    const existingAccount = await this.accountModel.findOne({
      refreshTokens: { $elemMatch: { token: decodedRefreshToken.token } },
    });
    if (!existingAccount) {
      // return silently if token not found
      return;
    }

    existingAccount.refreshTokens = existingAccount.refreshTokens?.filter(
      (rt) => rt.token !== decodedRefreshToken.token,
    );
    await existingAccount.save();
  }

  public async logoutAllDevices(email: string): Promise<void> {
    const existingAccount = await this.accountModel
      .findOne({ email })
      .select('+refreshTokens');
    if (!existingAccount) {
      // return silently if account not found
      return;
    }

    existingAccount.refreshTokens = [];
    await existingAccount.save();
  }

  public async verifyAccessToken(accessToken: string): Promise<TokenPayload> {
    try {
      const payload = jwt.verify(accessToken, env.auth.accessTokenSecret);
      return payload as TokenPayload;
    } catch (_err) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Invalid or expired access token. Please login again.',
      );
    }
  }

  public async refreshTokens(
    refreshToken: string,
    { deviceInfo, ipInfo }: UserRefreshTokensConfig,
  ): Promise<{
    account: Partial<IAccount>;
    accessToken: string;
    refreshToken: string;
  }> {
    const decodedRefreshToken = await this.decodeRefreshToken(refreshToken);
    const existingAccount = await this.accountModel
      .findOne({
        refreshTokens: { $elemMatch: { token: decodedRefreshToken.token } },
      })
      .select('+refreshTokens');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Invalid refresh token',
      );
    }

    const refreshTokenIndex = existingAccount.refreshTokens?.findIndex(
      (rt) => rt.token === decodedRefreshToken.token,
    );
    if (refreshTokenIndex === undefined || refreshTokenIndex === -1) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Invalid refresh token',
      );
    }

    const refreshTokenObject =
      existingAccount.refreshTokens?.[refreshTokenIndex];
    if (!refreshTokenObject || refreshTokenObject.expires < new Date()) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Refresh token expired',
      );
    }

    if (!this.checkSameDevice(deviceInfo, refreshTokenObject)) {
      // Sign out from all devices
      existingAccount.refreshTokens = [];
      await existingAccount.save();

      // Publish events for force logout
      this.publisher.auth.publishRootUserForceLoggedOutEvent({
        account: { alias: existingAccount.alias, email: existingAccount.email },
        deviceInfo,
        ipInfo,
      });

      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Device mismatch. Logged out from all devices.',
      );
    }

    const payload = await this.generatePayload({
      type: 'fws-root',
      user: {},
      account: existingAccount,
    });
    const accessToken = await this.generateAccessToken(payload);
    const newRefreshToken = await this.generateRefreshToken(
      payload,
      deviceInfo,
    );

    existingAccount.refreshTokens?.splice(refreshTokenIndex, 1);
    existingAccount.refreshTokens?.push(newRefreshToken);
    await existingAccount.save();

    const accountObject = this.excludeAccountSensitiveFields(
      existingAccount.toObject(),
    );

    const encodedRefreshToken = await this.encodeRefreshToken(newRefreshToken);
    return {
      account: accountObject,
      accessToken,
      refreshToken: encodedRefreshToken,
    };
  }

  public async requestPasswordReset(data: RequestPasswordResetDTO) {
    const existingAccount = await this.accountModel
      .findOne({
        email: data.email,
      })
      .select('+refreshTokens +resetPasswordToken +resetPasswordTokenExpires');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    const payload = await this.generatePayload({
      type: 'fws-root',
      user: {},
      account: existingAccount,
    });
    const resetPasswordToken = this.generateResetPasswordToken(payload);
    existingAccount.resetPasswordToken = resetPasswordToken;
    existingAccount.resetPasswordTokenExpires = new Date(
      Date.now() + env.auth.resetPasswordTokenExpiresInSeconds * 1000,
    );
    if (data.logoutAllDevices) {
      existingAccount.refreshTokens = [];
    }
    await existingAccount.save();

    // Publish events
    this.publisher.auth.publishRootUserPasswordChangeRequestedEvent({
      account: { alias: existingAccount.alias, email: existingAccount.email },
      resetPasswordToken,
    });
  }

  public async resetPassword(
    data: ResetPasswordDTO,
    config: ResetPasswordConfig,
  ): Promise<void> {
    const existingAccount = await this.accountModel
      .findOne({ email: data.user.email })
      .select('+passwordHash +resetPasswordToken +resetPasswordTokenExpires');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    // will be true if token is valid and not expired
    let isTokenValid =
      existingAccount.resetPasswordToken === data.user.currentPasswordOrToken &&
      existingAccount.resetPasswordTokenExpires &&
      existingAccount.resetPasswordTokenExpires > new Date();

    // check if it's the current password
    const passwordsMatch = await this.comparePasswords(
      data.user.currentPasswordOrToken,
      existingAccount.passwordHash || '',
    );

    if (!isTokenValid && !passwordsMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Your current password or token is incorrect',
      );
    }

    // don't allow to reset password with the same password
    if (
      await this.comparePasswords(
        data.user.newPassword,
        existingAccount.passwordHash || '',
      )
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'New password cannot be the same as the current password',
      );
    }

    const hashedPassword = await this.hashPassword(data.user.newPassword);
    existingAccount.passwordHash = hashedPassword;
    // logout all devices if requested
    if (data.logoutAllDevices) {
      existingAccount.refreshTokens = [];
    }
    existingAccount.resetPasswordToken = undefined;
    existingAccount.resetPasswordTokenExpires = undefined;
    await existingAccount.save();

    // Publish events
    this.publisher.auth.publishRootUserPasswordChangedEvent({
      account: { alias: existingAccount.alias, email: existingAccount.email },
      deviceInfo: config.deviceInfo,
      ipInfo: config.ipInfo,
    });
  }

  public async generateAccountChooser(
    newRefreshToken: string,
    existingAccountChooser: AccountChooser,
    existingRefreshTokensMapping: Record<string, string>,
  ): Promise<{
    refreshTokenCookieName: string;
    accountChooser: AccountChooser;
  }> {
    const decodedRefreshToken = await this.decodeRefreshToken(newRefreshToken);
    const decodedExistingRefreshTokens = await Promise.all(
      Object.values(existingRefreshTokensMapping).map(this.decodeRefreshToken),
    );
    const existingRefreshToken = decodedExistingRefreshTokens.find(
      (rt: IRefreshToken) => rt.token === decodedRefreshToken.token,
    );
    const existingRefreshTokenCookieName = Object.keys(
      existingRefreshTokensMapping,
    ).find((key) => existingRefreshTokensMapping[key] === newRefreshToken);

    if (existingRefreshToken && existingRefreshTokenCookieName) {
      return {
        refreshTokenCookieName: existingRefreshTokenCookieName,
        accountChooser: existingAccountChooser,
      };
    }

    const refreshTokenCookieName = `rt_${crypto.randomBytes(8).toString('hex')}`;
    const accountChooser = {
      current: refreshTokenCookieName,
      accounts: [
        ...new Set([
          ...existingAccountChooser.accounts, // existing keys
          refreshTokenCookieName,
        ]),
      ],
    };
    return { refreshTokenCookieName, accountChooser };
  }

  public async removeAccountFromAccountChooser(
    refreshToken: string,
    accountChooser: AccountChooser,
    refreshTokenMapping: Record<string, string>,
  ): Promise<AccountChooser> {
    const decodedRefreshToken = await this.decodeRefreshToken(refreshToken);
    const decodedRefreshTokens = await Promise.all(
      Object.values(refreshTokenMapping).map(this.decodeRefreshToken),
    );
    const existingRefreshToken = decodedRefreshTokens.find(
      (rt: IRefreshToken) => rt.token === decodedRefreshToken.token,
    );
    const refreshTokenCookieName = Object.keys(refreshTokenMapping).find(
      (key) => refreshTokenMapping[key] === refreshToken,
    );

    if (!existingRefreshToken || !refreshTokenCookieName) {
      return accountChooser;
    }

    const updatedAccounts = accountChooser.accounts.filter(
      (account) => account !== refreshTokenCookieName,
    );

    return { ...accountChooser, accounts: updatedAccounts };
  }

  public async enable2FAForRoot(
    userDTO: Enable2FADTO,
    config: Enable2FAConfig,
  ): Promise<{ recoveryCodes: string[] }> {
    const { email, password } = userDTO;
    const existingAccount = await this.accountModel
      .findOne({ email })
      .select('+twoFactorAuth +passwordHash +recoveryDetails');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (existingAccount.twoFactorAuth?.enabled) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        '2FA already enabled for the account',
      );
    }

    const passwordsMatch = await this.comparePasswords(
      password,
      existingAccount.passwordHash || '',
    );
    if (!passwordsMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Incorrect password',
      );
    }

    existingAccount.twoFactorAuth = {
      enabled: true,
      otp: { enabled: true }, // OTP based 2FA enabled by default
      totp: { enabled: false },
    };
    const backupCodes = await this.generateBackupCodes();
    existingAccount.recoveryDetails = {
      backupCodes: backupCodes.map((code) => ({ code })),
    };
    await existingAccount.save();

    // Publish events
    this.publisher.auth.publishRootUser2FAEnabledEvent({
      account: { alias: existingAccount.alias, email: existingAccount.email },
      deviceInfo: config.deviceInfo,
      ipInfo: config.ipInfo,
    });

    const decryptedCodes = await Promise.all(
      backupCodes.map(this.decryptBackupCode),
    );
    return { recoveryCodes: decryptedCodes };
  }

  public async disable2FAForRoot(
    userDTO: Disable2FADTO,
    config: Disable2FAConfig,
  ): Promise<void> {
    const { email, password } = userDTO;
    const existingAccount = await this.accountModel
      .findOne({ email })
      .select('+twoFactorAuth +passwordHash +recoveryDetails');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (!existingAccount.twoFactorAuth?.enabled) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        '2FA not enabled for the account',
      );
    }

    const passwordsMatch = await this.comparePasswords(
      password,
      existingAccount.passwordHash || '',
    );
    if (!passwordsMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Incorrect password',
      );
    }

    existingAccount.twoFactorAuth.enabled = false;
    // Disable OTP if enabled
    existingAccount.twoFactorAuth.otp.hash = undefined;
    existingAccount.twoFactorAuth.otp.expires = undefined;
    // Disable TOTP if enabled
    existingAccount.twoFactorAuth.totp.enabled = false;
    existingAccount.twoFactorAuth.totp.secret = undefined;
    // Clear recovery codes
    existingAccount.recoveryDetails = {
      backupCodes: [],
    };
    await existingAccount.save();
    // Publish events
    this.publisher.auth.publishRootUser2FADisabledEvent({
      account: { alias: existingAccount.alias, email: existingAccount.email },
      deviceInfo: config.deviceInfo,
      ipInfo: config.ipInfo,
    });
  }

  public async getRoot2faLoginMethods(token: string): Promise<string[]> {
    const { email } = (await this.verify2FAToken(
      token,
    )) as RootAccountTokenPayload;

    const existingAccount = await this.accountModel
      .findOne({ email })
      .select('+twoFactorAuth +recoveryDetails');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (!existingAccount.twoFactorAuth?.enabled) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        '2FA not enabled for the account',
      );
    }

    const methods: string[] = ['otp']; // OTP based 2FA enabled by default
    methods.push('recovery'); // Recovery codes are always available
    if (existingAccount.twoFactorAuth.totp?.enabled) {
      methods.push('totp');
    }
    if (existingAccount.recoveryDetails?.emailVerified) {
      methods.push('recovery-email');
    }

    return methods;
  }

  public async loginRootWith2FAOTP(
    userDTO: RootUserOTPLoginDTO,
    config: RootUserLoginConfig,
  ): Promise<{
    account: Partial<IAccount>;
    accessToken: string;
    refreshToken: string;
  }> {
    const { token } = userDTO;
    const twoFactorAuthPayload = (await this.verify2FAToken(
      token,
    )) as RootAccountTokenPayload;

    const existingAccount = await this.accountModel
      .findOne({ email: twoFactorAuthPayload.email })
      .select('+twoFactorAuth +refreshTokens');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (
      !existingAccount.twoFactorAuth?.enabled ||
      !existingAccount.twoFactorAuth.otp.enabled
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'OTP based 2FA not enabled for this account',
      );
    }

    if (
      !existingAccount.twoFactorAuth.otp.hash ||
      !existingAccount.twoFactorAuth.otp.expires
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'OTP not generated. Please request a new OTP',
      );
    }

    const otpMatch = await this.comparePasswords(
      userDTO.otp,
      existingAccount.twoFactorAuth.otp.hash || '',
    );
    if (!otpMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Incorrect OTP',
      );
    }

    if (
      existingAccount.twoFactorAuth.otp.expires &&
      existingAccount.twoFactorAuth.otp.expires < new Date()
    ) {
      existingAccount.twoFactorAuth.otp.hash = undefined;
      existingAccount.twoFactorAuth.otp.expires = undefined;
      await existingAccount.save();

      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'OTP has expired',
      );
    }

    // Filter expired refresh tokens
    existingAccount.refreshTokens = await this.filterExpiredRefreshTokens(
      existingAccount.refreshTokens || [],
    );
    // Check if device already present
    const existingRefreshToken = existingAccount.refreshTokens?.find(
      (rt: IRefreshToken) => this.checkSameDevice(config.deviceInfo, rt),
    );
    if (existingRefreshToken) {
      const payload = await this.generatePayload(
        {
          type: 'fws-root',
          user: {},
          account: existingAccount,
        },
        true,
      );
      const accessToken = await this.generateAccessToken(payload);
      const encodedRefreshToken =
        await this.encodeRefreshToken(existingRefreshToken);

      const accountObject = this.excludeAccountSensitiveFields(
        existingAccount.toObject(),
      );
      return {
        account: accountObject,
        accessToken,
        refreshToken: encodedRefreshToken,
      };
    }

    const payload = await this.generatePayload(
      {
        type: 'fws-root',
        user: {},
        account: existingAccount,
      },
      true,
    );
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(
      payload,
      config.deviceInfo,
    );

    existingAccount.refreshTokens.push(refreshToken);
    existingAccount.twoFactorAuth.otp.hash = undefined;
    existingAccount.twoFactorAuth.otp.expires = undefined;
    existingAccount.isEmailVerified = true; // Email verified on OTP login
    await existingAccount.save();

    const accountObject = this.excludeAccountSensitiveFields(
      existingAccount.toObject(),
    );

    // Publish events
    this.publisher.auth.publishRootUserLoggedInEvent({
      account: {
        alias: accountObject.alias ?? '',
        email: accountObject.email ?? '',
      },
      deviceInfo: config.deviceInfo,
    });

    const encodedRefreshToken = await this.encodeRefreshToken(refreshToken);
    return {
      account: accountObject,
      accessToken,
      refreshToken: encodedRefreshToken,
    };
  }

  public async send2FALoginOTPtoRoot(
    token: string,
  ): Promise<{ expires: Date }> {
    const { email } = (await this.verify2FAToken(
      token,
    )) as RootAccountTokenPayload;

    const existingAccount = await this.accountModel
      .findOne({ email })
      .select('+twoFactorAuth');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (
      !existingAccount.twoFactorAuth?.enabled ||
      !existingAccount.twoFactorAuth.otp.enabled
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'OTP based 2FA not enabled for this account',
      );
    }

    if (
      existingAccount.twoFactorAuth.otp.expires &&
      existingAccount.twoFactorAuth.otp.expires > new Date()
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'You already have an active OTP. Please wait for it to expire.',
      );
    }

    const otp = await this.generateRandomOTP();
    existingAccount.twoFactorAuth.otp.hash = await this.hashPassword(otp);
    existingAccount.twoFactorAuth.otp.expires = new Date(
      Date.now() + env.twoFactorAuth.otp.expiresInSeconds * 1000,
    );
    await existingAccount.save();

    const account = this.excludeAccountSensitiveFields(
      existingAccount.toObject(),
    );

    // Publish events
    this.publisher.auth.publishRootUser2faOtpGeneratedEvent({
      account: { alias: account.alias ?? '', email: account.email ?? '' },
      otp,
    });

    return { expires: existingAccount.twoFactorAuth.otp.expires };
  }

  public async send2FALoginOTPToRootRecoveryEmail(
    token: string,
  ): Promise<{ expires: Date }> {
    const { email } = (await this.verify2FAToken(
      token,
    )) as RootAccountTokenPayload;

    const existingAccount = await this.accountModel
      .findOne({ email })
      .select('+twoFactorAuth +recoveryDetails');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (
      !existingAccount.twoFactorAuth?.enabled ||
      !existingAccount.twoFactorAuth.otp.enabled
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'OTP based 2FA not enabled for this account',
      );
    }

    if (
      !existingAccount.recoveryDetails?.email ||
      !existingAccount.recoveryDetails?.emailVerified
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Recovery email not verified',
      );
    }

    if (
      existingAccount.twoFactorAuth.otp.expires &&
      existingAccount.twoFactorAuth.otp.expires > new Date()
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'You already have an active OTP. Please wait for it to expire.',
      );
    }

    const otp = await this.generateRandomOTP();
    existingAccount.twoFactorAuth.otp.hash = await this.hashPassword(otp);
    existingAccount.twoFactorAuth.otp.expires = new Date(
      Date.now() + env.twoFactorAuth.otp.expiresInSeconds * 1000,
    );
    await existingAccount.save();

    const account = this.excludeAccountSensitiveFields(
      existingAccount.toObject(),
    );

    // Publish events
    this.publisher.auth.publishRootUser2faRecoveryOtpGeneratedEvent({
      recoveryEmail: existingAccount.recoveryDetails.email,
      account: { alias: account.alias ?? '', email: account.email ?? '' },
      otp,
    });

    return { expires: existingAccount.twoFactorAuth.otp.expires };
  }

  public async setup2FATOTPForRoot(
    userDTO: Setup2FAAuthenticatorDTO,
  ): Promise<{ otpAuthUrl: string }> {
    const { email, password } = userDTO;
    const existingAccount = await this.accountModel
      .findOne({ email })
      .select('+twoFactorAuth +passwordHash');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (!existingAccount.twoFactorAuth?.enabled) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        '2FA not enabled for the account',
      );
    }

    const passwordsMatch = await this.comparePasswords(
      password,
      existingAccount.passwordHash || '',
    );
    if (!passwordsMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Incorrect password',
      );
    }

    if (existingAccount.twoFactorAuth.totp.enabled) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Authenticator already enabled for the account',
      );
    }

    const secret = authenticator.generateSecret();
    const encodedSecret = await this.encrypt2FATOTPSecret(secret);
    existingAccount.twoFactorAuth.totp.secret = encodedSecret;
    existingAccount.twoFactorAuth.totp.enabled = true;
    await existingAccount.save();

    // Generate QR code for the account
    const otpAuthUrl = authenticator.keyuri(email, meta.company.name, secret);

    // Publish events

    return { otpAuthUrl };
  }

  public async regenerate2FATOTPForRoot(
    userDTO: Setup2FAAuthenticatorDTO,
  ): Promise<{ otpAuthUrl: string }> {
    const { email, password } = userDTO;
    const existingAccount = await this.accountModel
      .findOne({ email })
      .select('+twoFactorAuth +passwordHash');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (!existingAccount.twoFactorAuth?.enabled) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        '2FA not enabled for the account',
      );
    }

    const passwordsMatch = await this.comparePasswords(
      password,
      existingAccount.passwordHash || '',
    );
    if (!passwordsMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Incorrect password',
      );
    }

    if (!existingAccount.twoFactorAuth.totp.enabled) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Authenticator not enabled for the account',
      );
    }

    const secret = authenticator.generateSecret();
    const encodedSecret = await this.encrypt2FATOTPSecret(secret);
    existingAccount.twoFactorAuth.totp.secret = encodedSecret;
    await existingAccount.save();

    // Generate QR code for the account
    const otpAuthUrl = authenticator.keyuri(email, meta.company.name, secret);

    // Publish events

    return { otpAuthUrl };
  }

  public async disable2FATOTPForRoot(
    userDTO: Disable2FADTO,
    _config: Disable2FAConfig,
  ): Promise<void> {
    const { email, password } = userDTO;
    const existingAccount = await this.accountModel
      .findOne({ email })
      .select('+twoFactorAuth +passwordHash');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (!existingAccount.twoFactorAuth?.enabled) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        '2FA not enabled for the account',
      );
    }

    if (!existingAccount.twoFactorAuth.totp.enabled) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Authenticator not enabled for the account',
      );
    }

    const passwordsMatch = await this.comparePasswords(
      password,
      existingAccount.passwordHash || '',
    );
    if (!passwordsMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Incorrect password',
      );
    }

    existingAccount.twoFactorAuth.totp.secret = undefined;
    existingAccount.twoFactorAuth.totp.enabled = false;
    await existingAccount.save();

    // Publish events
  }

  public async loginRootWith2FATOTP(
    userDTO: RootUserOTPLoginDTO,
    config: RootUserLoginConfig,
  ): Promise<{
    account: Partial<IAccount>;
    accessToken: string;
    refreshToken: string;
  }> {
    const { token, otp } = userDTO;
    const twoFactorAuthPayload = (await this.verify2FAToken(
      token,
    )) as RootAccountTokenPayload;

    const existingAccount = await this.accountModel
      .findOne({ email: twoFactorAuthPayload.email })
      .select('+twoFactorAuth +refreshTokens');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (
      !existingAccount.twoFactorAuth?.enabled ||
      !existingAccount.twoFactorAuth.totp.enabled
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Authenticator based 2FA not enabled for this account',
      );
    }

    if (
      !existingAccount.twoFactorAuth.totp.secret ||
      !existingAccount.twoFactorAuth.totp.enabled
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Authenticator not enabled. Please setup the authenticator first.',
      );
    }

    const secret = await this.decrypt2FATOTPSecret(
      existingAccount.twoFactorAuth.totp.secret,
    );
    const otpMatch = authenticator.verify({ token: otp, secret });
    if (!otpMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Incorrect OTP',
      );
    }

    // Filter expired refresh tokens
    existingAccount.refreshTokens = await this.filterExpiredRefreshTokens(
      existingAccount.refreshTokens || [],
    );
    // Check if device already present
    const existingRefreshToken = existingAccount.refreshTokens?.find(
      (rt: IRefreshToken) => this.checkSameDevice(config.deviceInfo, rt),
    );
    if (existingRefreshToken) {
      const payload = await this.generatePayload(
        {
          type: 'fws-root',
          user: {},
          account: existingAccount,
        },
        true,
      );
      const accessToken = await this.generateAccessToken(payload);
      const encodedRefreshToken =
        await this.encodeRefreshToken(existingRefreshToken);

      const accountObject = this.excludeAccountSensitiveFields(
        existingAccount.toObject(),
      );
      return {
        account: accountObject,
        accessToken,
        refreshToken: encodedRefreshToken,
      };
    }

    const payload = await this.generatePayload(
      {
        type: 'fws-root',
        user: {},
        account: existingAccount,
      },
      true,
    );
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(
      payload,
      config.deviceInfo,
    );

    existingAccount.refreshTokens.push(refreshToken);
    existingAccount.save();

    const accountObject = this.excludeAccountSensitiveFields(
      existingAccount.toObject(),
    );

    // Publish events
    this.publisher.auth.publishRootUserLoggedInEvent({
      account: {
        alias: accountObject.alias ?? '',
        email: accountObject.email ?? '',
      },
      deviceInfo: config.deviceInfo,
    });

    const encodedRefreshToken = await this.encodeRefreshToken(refreshToken);
    return {
      account: accountObject,
      accessToken,
      refreshToken: encodedRefreshToken,
    };
  }

  public async requestUpdateRootRecoveryEmail(
    userDTO: UpdateRecoveryEmailDTO,
  ): Promise<void> {
    const existingAccount = await this.accountModel
      .findOne({ email: userDTO.email })
      .select('+passwordHash +recoveryDetails');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    const passwordsMatch = await this.comparePasswords(
      userDTO.password,
      existingAccount.passwordHash || '',
    );
    if (!passwordsMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Incorrect password',
      );
    }

    if (existingAccount.recoveryDetails?.email === userDTO.newRecoveryEmail) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Recovery email is already set for this email',
      );
    }

    const payload = await this.generatePayload({
      type: 'fws-root',
      user: {},
      account: existingAccount,
    });
    const recoveryEmailVerificationToken =
      await this.generateRecoveryEmailVerificationToken({
        ...payload,
        recoveryEmail: userDTO.newRecoveryEmail,
      });

    // Publish events
    this.publisher.auth.publishRootUserRecoveryEmailUpdateRequestedEvent({
      account: {
        alias: existingAccount.alias ?? '',
        email: existingAccount.email ?? '',
      },
      recoveryEmail: userDTO.newRecoveryEmail,
      emailVerificationToken: recoveryEmailVerificationToken,
    });
  }

  public async verifyAndUpdateRootRecoveryEmail(token: string): Promise<void> {
    const payload = (await this.verifyRecoveryEmailVerificationToken(
      token,
    )) as RootAccountTokenPayload;

    const existingAccount = await this.accountModel
      .findOne({ email: payload.email })
      .select('+recoveryDetails');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    existingAccount.recoveryDetails = {
      ...(existingAccount.recoveryDetails || {
        backupCodes: [],
      }),
      emailVerified: true,
    };
    await existingAccount.save();
  }

  public async regenerateRootRecoveryCodes(
    userDTO: RegenerateRecoveryCodesDTO,
  ): Promise<{ recoveryCodes: string[] }> {
    const existingAccount = await this.accountModel
      .findOne({ email: userDTO.email })
      .select('+passwordHash +recoveryDetails');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    const passwordsMatch = await this.comparePasswords(
      userDTO.password,
      existingAccount.passwordHash || '',
    );
    if (!passwordsMatch) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Incorrect password',
      );
    }

    const recoveryCodes = await this.generateBackupCodes();
    existingAccount.recoveryDetails = {
      ...(existingAccount.recoveryDetails || {
        emailVerified: false,
      }),
      backupCodes: recoveryCodes.map((code) => ({ code })),
    };
    await existingAccount.save();

    const decryptedCodes = await Promise.all(
      recoveryCodes.map(this.decryptBackupCode),
    );

    return { recoveryCodes: decryptedCodes };
  }

  public async loginRootWithRecoveryCode(
    userDTO: RootUserRecoveryCodeLoginDTO,
    config: RootUserLoginConfig,
  ): Promise<{
    account: Partial<IAccount>;
    accessToken: string;
    refreshToken: string;
  }> {
    const { token, code: recoveryCode } = userDTO;
    const payload = (await this.verifyRecoveryEmailVerificationToken(
      token,
    )) as RootAccountTokenPayload;

    const existingAccount = await this.accountModel
      .findOne({ email: payload.email })
      .select('+recoveryDetails +refreshTokens');
    if (!existingAccount) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'account not found',
      );
    }

    if (
      !existingAccount.recoveryDetails?.emailVerified ||
      !existingAccount.recoveryDetails.backupCodes
    ) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Recovery email not verified or backup codes not generated',
      );
    }

    const decryptedBackupCodes = await Promise.all(
      existingAccount.recoveryDetails.backupCodes.map((bc: IBackupCode) =>
        this.decryptBackupCode(bc.code),
      ),
    );
    const backupCodeIndex = decryptedBackupCodes.findIndex(
      (code: string) => code === recoveryCode,
    );
    if (backupCodeIndex === -1) {
      throw new AppError(
        CommonErrors.Unauthorized.name,
        CommonErrors.Unauthorized.statusCode,
        'Invalid recovery code',
      );
    }

    // mark the recovery code as used with a timestamp
    existingAccount.recoveryDetails.backupCodes[backupCodeIndex].usedAt =
      new Date();

    // Filter expired refresh tokens
    existingAccount.refreshTokens = await this.filterExpiredRefreshTokens(
      existingAccount.refreshTokens || [],
    );
    // Check if device already present
    const existingRefreshToken = existingAccount.refreshTokens?.find(
      (rt: IRefreshToken) => this.checkSameDevice(config.deviceInfo, rt),
    );
    if (existingRefreshToken) {
      const payload = await this.generatePayload(
        {
          type: 'fws-root',
          user: {},
          account: existingAccount,
        },
        true,
      );
      const accessToken = await this.generateAccessToken(payload);
      const encodedRefreshToken =
        await this.encodeRefreshToken(existingRefreshToken);

      const accountObject = this.excludeAccountSensitiveFields(
        existingAccount.toObject(),
      );
      return {
        account: accountObject,
        accessToken,
        refreshToken: encodedRefreshToken,
      };
    }

    const newRefreshToken = await this.generateRefreshToken(
      payload,
      config.deviceInfo,
    );

    existingAccount.refreshTokens.push(newRefreshToken);
    await existingAccount.save();

    const accountObject = this.excludeAccountSensitiveFields(
      existingAccount.toObject(),
    );

    // Publish events
    this.publisher.auth.publishRootUserLoggedInEvent({
      account: {
        alias: accountObject.alias ?? '',
        email: accountObject.email ?? '',
      },
      deviceInfo: config.deviceInfo,
    });

    const encodedRefreshToken = await this.encodeRefreshToken(newRefreshToken);
    return {
      account: accountObject,
      accessToken: '',
      refreshToken: encodedRefreshToken,
    };
  }
}
