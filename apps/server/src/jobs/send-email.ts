import { redis } from '@/loaders/redis';
import { MailerService } from '@/services/mailer';
import { SendEmailJobDTO } from '@/types/jobs/email';
import { errorLogger } from '@/utils/logger';
import { Worker } from 'bullmq';

const mailer = new MailerService();
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

const worker = new Worker<SendEmailJobDTO>(
  'root-emails',
  async (job) => {
    const payload = job.data;

    switch (payload.event) {
      case 'user-registered':
        break;
      case 'user-email-verification-requested': {
        const data = payload.data;
        await mailer.sendEmailVerificationEmail({
          to: data.account.email,
          emailVerificationToken: data.emailVerificationToken,
          user: data.account,
        });
        break;
      }
      case 'user-logged-in': {
        // const data = payload.data;
        // await mailer.sendLoginActivityEmail({
        //   to: data.account.email,
        //   user: data.account,
        //   deviceInfo: data.deviceInfo,
        // });
        break;
      }
      case 'user-force-logged-out': {
        const data = payload.data;
        await mailer.sendForceLoggedOutEmail({
          to: data.account.email,
          user: data.account,
          deviceInfo: data.deviceInfo,
          ipInfo: data.ipInfo ?? unknownIPInfo,
        });
        break;
      }
      case 'user-password-change-requested': {
        const data = payload.data;
        await mailer.sendResetPasswordEmail({
          to: data.account.email,
          resetPasswordToken: data.resetPasswordToken,
          user: data.account,
        });
        break;
      }
      case 'user-password-changed': {
        const data = payload.data;
        await mailer.sendPasswordChangedEmail({
          to: data.account.email,
          user: data.account,
          deviceInfo: data.deviceInfo,
          ipInfo: data.ipInfo ?? unknownIPInfo,
        });
        break;
      }
      case 'user-2fa-enabled':
        break;
      case 'user-2fa-disabled':
        break;
      case 'user-2fa-otp-generated': {
        const data = payload.data;
        await mailer.sendTwoFactorAuthOTPEmail({
          to: data.account.email,
          user: data.account,
          otp: data.otp,
        });
        break;
      }
      case 'user-recovery-email-update-requested': {
        const data = payload.data;
        await mailer.sendRecoveryEmailVerificationEmail({
          to: data.account.email,
          user: data.account,
          emailVerificationToken: data.emailVerificationToken,
        });
        break;
      }
      case 'user-2fa-recovery-otp-generated': {
        const data = payload.data;
        await mailer.sendRecoveryEmailOTP({
          to: data.account.email,
          user: data.account,
          otp: data.otp,
        });
        break;
      }
      default:
        throw new Error(`Unsupported event: ${payload}`);
    }
  },
  {
    connection: redis,
  },
);

worker.on('completed', (job) => {
  console.log(`Email Job completed: ${job.id}`);
});

worker.on('failed', (job, err) => {
  errorLogger.error(`Email Job failed: ${job?.id}`, err);
});

worker.on('error', (err) => {
  errorLogger.error('Email Worker error', err);
});
