import { IDeviceInfo } from './user-agent';

export type IUserRole = 'user' | 'admin';

export type IRefreshToken = {
  token: string;
  expires: Date;
  deviceInfo?: IDeviceInfo;
};

export type ITwoFactorAuth = {
  enabled: boolean; // 2FA enabled or not
  otp: {
    enabled: boolean; // OTP enabled or not
    hash?: string; // Hashed OTP
    expires?: Date;
  };
  // for authenticator apps
  totp: {
    enabled: boolean; // TOTP enabled or not
    secret?: string;
  };
};

export type IBackupCode = {
  code: string;
  usedAt?: Date;
};

export type IRecoveryDetails = {
  backupCodes: IBackupCode[];
  email?: string;
  emailVerified?: boolean;
  backupCodesUsedCount?: number;
};

export interface IAccount {
  _id: string;
  // Base properties, required for creating a new user
  // Optional because we will check for these in application code
  alias: string;
  email: string;
  isEmailVerified: boolean;
  passwordHash: string;

  // Authentication
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  refreshTokens: IRefreshToken[];

  // 2FA
  twoFactorAuth: ITwoFactorAuth;
  // Recovery
  recoveryDetails?: IRecoveryDetails;
}
