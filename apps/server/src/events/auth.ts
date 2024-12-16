import {
  RootUserForceLoggedOutEventData,
  RootUserLoggedInEventData,
  RootUserEmailVerificationRequestedEventData,
  RootUserPasswordChangedEventData,
  RootUserPasswordChangeRequestedEventData,
  RootUserRegisteredEventData,
  RootUser2faOtpGeneratedEventData,
  RootUser2FAEnabledEventData,
  RootUser2FADisabledEventData,
  RootUserRecoveryEmailUpdateRequestedEventData,
  RootUser2faRecoveryOtpGeneratedEventData,
} from '../types/events/auth';
import { Queue } from 'bullmq';

export class AuthEventsPublisher {
  private readonly emailQueue: Queue;

  constructor(emailQueue: Queue) {
    this.emailQueue = emailQueue;
  }

  public publishRootUserRegisteredEvent(data: RootUserRegisteredEventData) {
    this.emailQueue.add('send-email', {
      event: 'user-registered',
      data,
    });
  }

  public publishRootUserLoggedInEvent(data: RootUserLoggedInEventData) {
    this.emailQueue.add('send-email', {
      event: 'user-logged-in',
      data,
    });
  }

  public publishRootUserEmailVerificationRequestedEvent(
    data: RootUserEmailVerificationRequestedEventData,
  ) {
    this.emailQueue.add('send-email', {
      event: 'user-email-verification-requested',
      data,
    });
  }

  public publishRootUserForceLoggedOutEvent(
    data: RootUserForceLoggedOutEventData,
  ) {
    this.emailQueue.add('send-email', {
      event: 'user-force-logged-out',
      data,
    });
  }

  public publishRootUserPasswordChangeRequestedEvent(
    data: RootUserPasswordChangeRequestedEventData,
  ) {
    this.emailQueue.add('send-email', {
      event: 'user-password-change-requested',
      data,
    });
  }

  public publishRootUserPasswordChangedEvent(
    data: RootUserPasswordChangedEventData,
  ) {
    this.emailQueue.add('send-email', {
      event: 'user-password-changed',
      data,
    });
  }

  public publishRootUser2FAEnabledEvent(data: RootUser2FAEnabledEventData) {
    this.emailQueue.add('send-email', {
      event: 'user-2fa-enabled',
      data,
    });
  }

  public publishRootUser2FADisabledEvent(data: RootUser2FADisabledEventData) {
    this.emailQueue.add('send-email', {
      event: 'user-2fa-disabled',
      data,
    });
  }

  public publishRootUser2faOtpGeneratedEvent(
    data: RootUser2faOtpGeneratedEventData,
  ) {
    this.emailQueue.add('send-email', {
      event: 'user-2fa-otp-generated',
      data,
    });
  }

  public publishRootUser2faRecoveryOtpGeneratedEvent(
    data: RootUser2faRecoveryOtpGeneratedEventData,
  ) {
    this.emailQueue.add('send-email', {
      event: 'user-2fa-recovery-otp-generated',
      data,
    });
  }

  public publishRootUserRecoveryEmailUpdateRequestedEvent(
    data: RootUserRecoveryEmailUpdateRequestedEventData,
  ) {
    this.emailQueue.add('send-email', {
      event: 'user-recovery-email-update-requested',
      data,
    });
  }
}
