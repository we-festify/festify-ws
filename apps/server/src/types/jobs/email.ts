import {
  RootUser2FADisabledEventData,
  RootUser2FAEnabledEventData,
  RootUser2faOtpGeneratedEventData,
  RootUser2faRecoveryOtpGeneratedEventData,
  RootUserEmailVerificationRequestedEventData,
  RootUserForceLoggedOutEventData,
  RootUserLoggedInEventData,
  RootUserPasswordChangedEventData,
  RootUserPasswordChangeRequestedEventData,
  RootUserRecoveryEmailUpdateRequestedEventData,
  RootUserRegisteredEventData,
} from '../events/auth';

export type SendUserRegisteredEmailJobDTO = {
  event: 'user-registered';
  data: RootUserRegisteredEventData;
};

export type SendUserEmailVerificationRequestedEmailJobDTO = {
  event: 'user-email-verification-requested';
  data: RootUserEmailVerificationRequestedEventData;
};

export type SendUserLoggedInEmailJobDTO = {
  event: 'user-logged-in';
  data: RootUserLoggedInEventData;
};

export type SendUserForceLoggedOutEmailJobDTO = {
  event: 'user-force-logged-out';
  data: RootUserForceLoggedOutEventData;
};

export type SendUserPasswordChangeRequestedEmailJobDTO = {
  event: 'user-password-change-requested';
  data: RootUserPasswordChangeRequestedEventData;
};

export type SendUserPasswordChangedEmailJobDTO = {
  event: 'user-password-changed';
  data: RootUserPasswordChangedEventData;
};

export type SendUser2FAEnabledEmailJobDTO = {
  event: 'user-2fa-enabled';
  data: RootUser2FAEnabledEventData;
};

export type SendUser2FADisabledEmailJobDTO = {
  event: 'user-2fa-disabled';
  data: RootUser2FADisabledEventData;
};

export type SendUser2faOtpGeneratedEmailJobDTO = {
  event: 'user-2fa-otp-generated';
  data: RootUser2faOtpGeneratedEventData;
};

export type SendUserRecoveryEmailUpdateRequestedEmailJobDTO = {
  event: 'user-recovery-email-update-requested';
  data: RootUserRecoveryEmailUpdateRequestedEventData;
};

export type SendUser2faRecoveryOtpGeneratedEmailJobDTO = {
  event: 'user-2fa-recovery-otp-generated';
  data: RootUser2faRecoveryOtpGeneratedEventData;
};

export type SendEmailJobDTO =
  | SendUserRegisteredEmailJobDTO
  | SendUserEmailVerificationRequestedEmailJobDTO
  | SendUserLoggedInEmailJobDTO
  | SendUserForceLoggedOutEmailJobDTO
  | SendUserPasswordChangeRequestedEmailJobDTO
  | SendUserPasswordChangedEmailJobDTO
  | SendUser2FAEnabledEmailJobDTO
  | SendUser2FADisabledEmailJobDTO
  | SendUser2faOtpGeneratedEmailJobDTO
  | SendUserRecoveryEmailUpdateRequestedEmailJobDTO
  | SendUser2faRecoveryOtpGeneratedEmailJobDTO;
