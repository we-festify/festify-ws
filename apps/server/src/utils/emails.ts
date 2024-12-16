import { env } from '@/config';
import { convertDurationToReadable } from './time';

export const getEmailVerificationEmail = (
  verificationUrl: string,
): {
  subject: string;
  text: string;
} => {
  const expires_in = convertDurationToReadable(
    env.auth.emailVerificationTokenExpiresInSeconds,
  );

  return {
    subject: 'Festify Web Services - Email Verification',
    text: `Dear Festify Web Services Customer,

Thank you for creating an account with us. To complete your registration, please verify your email address by clicking the link below. The link will expire in ${expires_in}.

${verificationUrl}

If you did not create an account with Festify Web Services, please ignore this email.

Sincerely,
The Festify Web Services Team`,
  };
};

export const getResetPasswordEmail = (
  resetUrl: string,
): {
  subject: string;
  text: string;
} => {
  const expires_in = convertDurationToReadable(
    env.auth.resetPasswordTokenExpiresInSeconds,
  );

  return {
    subject: 'Festify Web Services - Reset Password',
    text: `Dear Festify Web Services Customer,

You recently requested to reset your password. To complete the process, please click the link below. The link will expire in ${expires_in}.

${resetUrl}

If you did not request to reset your password, please ignore this email.

Sincerely,
The Festify Web Services Team`,
  };
};

export const getPasswordChangedEmail = (
  changeTime: string,
  ipInfo: { ip: string; location: string },
  deviceInfo: {
    browser: string;
    platform: string;
    os: string;
    source: string;
  },
): {
  subject: string;
  text: string;
} => {
  return {
    subject: 'Festify Web Services - Password Changed',
    text: `Dear Festify Web Services Customer,

Your password has been successfully changed. If you made this change, you can ignore this email. If you did not make this change, please contact our support team immediately as your account may have been compromised.

Date and Time: ${changeTime}
IP Address: ${ipInfo.ip}
Location: ${ipInfo.location}
Browser: ${deviceInfo.browser}
Platform: ${deviceInfo.platform}
Operating System: ${deviceInfo.os}
Source: ${deviceInfo.source}

If you have any questions or need further assistance, feel free to reach out to our support team.

Sincerely,
The Festify Web Services Team`,
  };
};

export const getForceLoggedOutEmail = (
  ipInfo: { ip: string; location: string },
  deviceInfo: {
    browser: string;
    platform: string;
    os: string;
    source: string;
  },
): {
  subject: string;
  text: string;
} => {
  return {
    subject: 'Festify Web Services - Forced Logout',
    text: `Dear Festify Web Services Customer,

We have detected suspicious activity on your account, and as a precautionary measure, we have logged you out of all devices. This action was taken to protect your account from unauthorized access.

Date and Time: ${new Date().toLocaleString()}
IP Address: ${ipInfo.ip}
Location: ${ipInfo.location}
Browser: ${deviceInfo.browser}
Platform: ${deviceInfo.platform}
Operating System: ${deviceInfo.os}
Source: ${deviceInfo.source}

If you recognize this activity, you can ignore this message. If you did not initiate this action or if you have any concerns about the security of your account, please contact our support team immediately.

To regain access, please reset your password and review your recent login activity.

Sincerely,
The Festify Web Services Team`,
  };
};
