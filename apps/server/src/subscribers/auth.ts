import EventEmitter from 'events';
import {
  RootUserForceLoggedOutEventData,
  RootUserLoggedInEventData,
  RootUserEmailVerificationRequestedEventData,
  RootUserPasswordChangedEventData,
  RootUserPasswordChangeRequestedEventData,
  RootUserRegisteredEventData,
  RootUser2faOtpGeneratedEventData,
  RootUserRecoveryEmailUpdateRequestedEventData,
  RootUser2faRecoveryOtpGeneratedEventData,
} from '../types/events/auth';
import { errorLogger } from '../utils/logger';
import { MailerService } from '../services/mailer';

const unknownIPInfo = {
  ip: 'unknown',
  location: {
    country: 'unknown',
    state: 'unknown',
    city: 'unknown',
    zip: 'unknown',
    timezone: 'unknown',
  },
};

export class AuthSubscriber {
  private readonly mailerService: MailerService;

  constructor(emitter: EventEmitter) {
    this.mailerService = new MailerService();

    emitter.on(
      'auth:root-user-registered',
      this.consumeRootUserRegisteredEvent.bind(this),
    );
    emitter.on(
      'auth:root-user-email-verification-requested',
      this.consumeRootUserEmailVerificationRequestedEvent.bind(this),
    );
    emitter.on(
      'auth:root-user-logged-in',
      this.consumeRootUserLoggedInEvent.bind(this),
    );
    emitter.on(
      'auth:root-user-password-change-requested',
      this.consumeRootUserPasswordChangeRequestedEvent.bind(this),
    );
    emitter.on(
      'auth:root-user-password-changed',
      this.consumeRootUserPasswordChangedEvent.bind(this),
    );
    emitter.on(
      'auth:root-user-force-logged-out',
      this.consumeRootUserForceLoggedOutEvent.bind(this),
    );
    emitter.on(
      'auth:root-user-2fa-otp-generated',
      this.consumeRootUser2faOtpGeneratedEvent.bind(this),
    );
    emitter.on(
      'auth:root-user-2fa-recovery-otp-generated',
      this.consumeRootUser2faRecoveryOtpGeneratedEvent.bind(this),
    );
    emitter.on(
      'auth:root-user-recovery-email-update-requested',
      this.consumeRootUserRecoveryEmailUpdateRequestedEvent.bind(this),
    );
  }

  public async consumeRootUserRegisteredEvent(
    data: RootUserRegisteredEventData,
  ) {
    try {
      // send welcome email
    } catch (err) {
      errorLogger.error(`Error sending email to ${data.account.email}`, err);
    }
  }

  public async consumeRootUserEmailVerificationRequestedEvent(
    data: RootUserEmailVerificationRequestedEventData,
  ) {
    try {
      await this.mailerService.sendEmailVerificationEmail({
        to: data.account.email,
        emailVerificationToken: data.emailVerificationToken,
        user: data.account,
      });
    } catch (err) {
      errorLogger.error(`Error sending email to ${data.account.email}`, err);
    }
  }

  public async consumeRootUserLoggedInEvent(data: RootUserLoggedInEventData) {
    try {
      await this.mailerService.sendLoginActivityEmail({
        to: data.account.email,
        user: data.account,
        deviceInfo: data.deviceInfo,
      });
    } catch (err) {
      errorLogger.error(`Error sending email to ${data.account.email}`, err);
    }
  }

  public async consumeRootUserPasswordChangeRequestedEvent(
    data: RootUserPasswordChangeRequestedEventData,
  ) {
    try {
      await this.mailerService.sendResetPasswordEmail({
        to: data.account.email,
        resetPasswordToken: data.resetPasswordToken,
        user: data.account,
      });
    } catch (err) {
      errorLogger.error(`Error sending email to ${data.account.email}`, err);
    }
  }

  public async consumeRootUserPasswordChangedEvent(
    data: RootUserPasswordChangedEventData,
  ) {
    try {
      await this.mailerService.sendPasswordChangedEmail({
        to: data.account.email,
        user: data.account,
        deviceInfo: data.deviceInfo,
        ipInfo: data.ipInfo ?? unknownIPInfo,
      });
    } catch (err) {
      errorLogger.error(`Error sending email to ${data.account.email}`, err);
    }
  }

  public async consumeRootUserForceLoggedOutEvent(
    data: RootUserForceLoggedOutEventData,
  ) {
    try {
      await this.mailerService.sendForceLoggedOutEmail({
        to: data.account.email,
        user: data.account,
        deviceInfo: data.deviceInfo,
        ipInfo: data.ipInfo ?? unknownIPInfo,
      });
    } catch (err) {
      errorLogger.error(`Error sending email to ${data.account.email}`, err);
    }
  }

  public async consumeRootUser2faOtpGeneratedEvent(
    data: RootUser2faOtpGeneratedEventData,
  ) {
    try {
      await this.mailerService.sendTwoFactorAuthOTPEmail({
        to: data.account.email,
        user: data.account,
        otp: data.otp,
      });
    } catch (err) {
      errorLogger.error(`Error sending email to ${data.account.email}`, err);
    }
  }

  public async consumeRootUser2faRecoveryOtpGeneratedEvent(
    data: RootUser2faRecoveryOtpGeneratedEventData,
  ) {
    try {
      await this.mailerService.sendRecoveryEmailOTP({
        to: data.recoveryEmail,
        user: data.account,
        otp: data.otp,
      });
    } catch (err) {
      errorLogger.error(`Error sending email to ${data.account.email}`, err);
    }
  }

  public async consumeRootUserRecoveryEmailUpdateRequestedEvent(
    data: RootUserRecoveryEmailUpdateRequestedEventData,
  ) {
    try {
      await this.mailerService.sendRecoveryEmailVerificationEmail({
        to: data.account.email,
        user: data.account,
        emailVerificationToken: data.emailVerificationToken,
      });
    } catch (err) {
      errorLogger.error(`Error sending email to ${data.account.email}`, err);
    }
  }
}
