import { IManagedUser } from '@sharedtypes/auth/user';
import { IDeviceInfo, IUserIPInfo } from '@sharedtypes/auth/user-agent';
import { IAccount } from '@sharedtypes/auth/account';

export interface RootUserRegisterDTO {
  alias: string;
  email: string;
  password: string;
}

export interface RootUserRegisterResponse {
  account: Partial<IAccount>;
}

export interface RootUserOTPLoginDTO {
  token: string;
  otp: string;
}

export interface RootUserLoginDTO {
  email: string;
  password: string;
}

export type RootUserLoginResponse =
  | {
      type: 'fws-root';
      account: Partial<IAccount>;
      accessToken: string;
      refreshToken: string;
    }
  | {
      requires2FA: boolean;
      token: string; // token to be used for getting user's details
    };

export interface RootUserLoginConfig {
  deviceInfo: IDeviceInfo;
}

export interface ManagedUserLoginDTO {
  alias: string;
  rootAccountId: string;
  password: string;
}

export interface ManagedUserLoginResponse {
  type: 'fws-user';
  user: Partial<IManagedUser>;
  accessToken: string;
  refreshToken: string;
}

export interface ManagedUserTokenPayload {
  alias: string;
  accountId: string;
  type: 'fws-user';

  mfaVerified?: boolean;
}

export interface RootAccountTokenPayload {
  email: string;
  accountId: string;
  type: 'fws-root';

  mfaVerified?: boolean;
}

export type TokenPayload = ManagedUserTokenPayload | RootAccountTokenPayload;

export interface UserRefreshTokensConfig {
  deviceInfo: IDeviceInfo;
  ipInfo?: IUserIPInfo;
}

export interface RequestPasswordResetDTO {
  email: string;
  logoutAllDevices?: boolean;
}

export interface ResetPasswordDTO {
  user: {
    email: string;
    currentPasswordOrToken: string;
    newPassword: string;
  };
  logoutAllDevices?: boolean;
}

export interface ResetPasswordConfig {
  deviceInfo: IDeviceInfo;
  ipInfo?: IUserIPInfo;
}

export interface AccountChooser {
  current: string; // the current account refresh token cookie name
  accounts: string[]; // list of cookie names which contain the account refresh token
}

export interface Enable2FADTO {
  email: string;
  password: string;
}

export interface Enable2FAConfig {
  deviceInfo: IDeviceInfo;
  ipInfo?: IUserIPInfo;
}

export interface Disable2FADTO {
  email: string;
  password: string;
}

export interface Disable2FAConfig {
  deviceInfo: IDeviceInfo;
  ipInfo?: IUserIPInfo;
}

export interface Setup2FAAuthenticatorDTO {
  email: string;
  password: string;
}

export interface UpdateRecoveryEmailDTO {
  email: string;
  password: string;
  newRecoveryEmail: string;
}

export interface RegenerateRecoveryCodesDTO {
  email: string;
  password: string;
}

export interface RootUserRecoveryCodeLoginDTO {
  token: string;
  code: string;
}
