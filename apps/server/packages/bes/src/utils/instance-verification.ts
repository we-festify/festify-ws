import { env } from '@/config';
import { AppError, CommonErrors } from '@/utils/errors';
import { convertDurationToReadable } from '@/utils/time';

if (!env.bes.instance_email_verification_expires_in) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    'Missing BES instance email verification expires in',
    true,
  );
}

export const getInstanceVerificationUrl = (token: string): string => {
  return `${env.url}/api/v1/d/bes/instances/verify-email?token=${token}`;
};

export const getInstanceVerificationEmail = (
  verificationUrl: string,
): {
  subject: string;
  text: string;
} => {
  return {
    subject: 'Festify Web Services - Instance Email Verification',
    text: `Dear Festify Web Services Customer,

We have received a request to authorize this email address for use with Festify BES. If you requested this verification, please go to the following URL to confirm that you are authorized to use this email address

${verificationUrl}

Your request will not be processed unless you confirm the address using this URL. This link expires ${convertDurationToReadable(
      parseInt(env.bes.instance_email_verification_expires_in ?? '0', 10),
    )} after your original verification request. If you did NOT request to verify this email address, do not click on the link. Please note that many times, the situation isn't a phishing attempt, but either a misunderstanding of how to use our service, or someone setting
up email-sending capabilities on your behalf as part of a legitimate service, but without having fully communicated the procedure first.
To learn more about sending email from Festify Web Services, please refer to the Festify BES Developer Guide at ${env.client.url}/docs.

Sincerely,
The Festify Web Services Team`,
  };
};
