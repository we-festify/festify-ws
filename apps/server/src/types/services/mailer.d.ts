import { IAccount } from '@sharedtypes/auth/account';
import { IDeviceInfo, IUserIPInfo } from '@sharedtypes/auth/user-agent';

export interface SendEmailDTO {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  template?: string;
}

export interface WelcomeEmailDTO {
  to: string;
  user: Partial<IAccount>;
}

export interface EmailVerificationEmailDTO {
  to: string;
  emailVerificationToken: string;
  user: Partial<IAccount>;
}

export interface LoginActivityEmailDTO {
  to: string;
  user: Partial<IAccount>;
  deviceInfo: IDeviceInfo;
}

export interface ResetPasswordEmailDTO {
  to: string;
  user: Partial<IAccount>;
  resetPasswordToken: string;
}

export interface PasswordChangedEmailDTO {
  to: string;
  user: Partial<IAccount>;
  deviceInfo: IDeviceInfo;
  ipInfo: IUserIPInfo;
}

export interface ForceLoggedOutDTO {
  to: string;
  user: Partial<IAccount>;
  deviceInfo: IDeviceInfo;
  ipInfo: IUserIPInfo;
}

export interface TwoFactorAuthOTPEmailDTO {
  to: string;
  otp: string;
  user: Partial<IAccount>;
}

export interface TwoFactorAuthEnabledEmailDTO {
  to: string;
  user: Partial<IAccount>;
  deviceInfo: IDeviceInfo;
  ipInfo: IUserIPInfo;
}

export interface TwoFactorAuthDisabledEmailDTO {
  to: string;
  user: Partial<IAccount>;
  deviceInfo: IDeviceInfo;
  ipInfo: IUserIPInfo;
}
