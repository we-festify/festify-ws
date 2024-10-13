import { IDeviceInfo, IUserIPInfo } from '../middlewares/user-agent';

export interface RootUserRegisteredEventData {
  account: {
    alias: string;
    email: string;
  };
}

export interface RootUserEmailVerificationRequestedEventData {
  account: {
    alias: string;
    email: string;
  };
  emailVerificationToken: string;
}

export interface RootUserLoggedInEventData {
  account: {
    alias: string;
    email: string;
  };
  deviceInfo: IDeviceInfo;
}

export interface RootUserForceLoggedOutEventData {
  account: {
    alias: string;
    email: string;
  };
  deviceInfo: IDeviceInfo;
  ipInfo?: IUserIPInfo;
}

export interface RootUserPasswordChangeRequestedEventData {
  account: {
    alias: string;
    email: string;
  };
  resetPasswordToken: string;
}

export interface RootUserPasswordChangedEventData {
  account: {
    alias: string;
    email: string;
  };
  deviceInfo: IDeviceInfo;
  ipInfo?: IUserIPInfo;
}

export interface RootUser2FAEnabledEventData {
  account: {
    alias: string;
    email: string;
  };
  deviceInfo: IDeviceInfo;
  ipInfo?: IUserIPInfo;
}

export interface RootUser2FADisabledEventData {
  account: {
    alias: string;
    email: string;
  };
  deviceInfo: IDeviceInfo;
  ipInfo?: IUserIPInfo;
}

export interface RootUser2faOtpGeneratedEventData {
  account: {
    alias: string;
    email: string;
  };
  otp: string;
}

export interface RootUser2faRecoveryOtpGeneratedEventData {
  recoveryEmail: string;
  account: {
    alias: string;
    email: string;
  };
  otp: string;
}

export interface RootUserRecoveryEmailUpdateRequestedEventData {
  account: {
    alias: string;
    email: string;
  };
  recoveryEmail: string;
  emailVerificationToken: string;
}
