import EventEmitter from 'events';
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

export class AuthEventsPublisher {
  private readonly emitter: EventEmitter;

  constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }

  public publishRootUserRegisteredEvent(data: RootUserRegisteredEventData) {
    this.emitter.emit('auth:root-user-registered', data);
  }

  public publishRootUserLoggedInEvent(data: RootUserLoggedInEventData) {
    this.emitter.emit('auth:root-user-logged-in', data);
  }

  public publishRootUserEmailVerificationRequestedEvent(
    data: RootUserEmailVerificationRequestedEventData,
  ) {
    this.emitter.emit('auth:root-user-email-verification-requested', data);
  }

  public publishRootUserForceLoggedOutEvent(
    data: RootUserForceLoggedOutEventData,
  ) {
    this.emitter.emit('auth:root-user-force-logged-out', data);
  }

  public publishRootUserPasswordChangeRequestedEvent(
    data: RootUserPasswordChangeRequestedEventData,
  ) {
    this.emitter.emit('auth:root-user-password-change-requested', data);
  }

  public publishRootUserPasswordChangedEvent(
    data: RootUserPasswordChangedEventData,
  ) {
    this.emitter.emit('auth:root-user-password-changed', data);
  }

  public publishRootUser2FAEnabledEvent(data: RootUser2FAEnabledEventData) {
    this.emitter.emit('auth:root-user-2fa-enabled', data);
  }

  public publishRootUser2FADisabledEvent(data: RootUser2FADisabledEventData) {
    this.emitter.emit('auth:root-user-2fa-disabled', data);
  }

  public publishRootUser2faOtpGeneratedEvent(
    data: RootUser2faOtpGeneratedEventData,
  ) {
    this.emitter.emit('auth:root-user-2fa-otp-generated', data);
  }

  public publishRootUser2faRecoveryOtpGeneratedEvent(
    data: RootUser2faRecoveryOtpGeneratedEventData,
  ) {
    this.emitter.emit('auth:root-user-2fa-recovery-otp-generated', data);
  }

  public publishRootUserRecoveryEmailUpdateRequestedEvent(
    data: RootUserRecoveryEmailUpdateRequestedEventData,
  ) {
    this.emitter.emit('auth:root-user-recovery-email-update-requested', data);
  }
}
