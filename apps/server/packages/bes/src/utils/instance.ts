import { env } from '@/config';
import { AppError, CommonErrors } from '@/utils/errors';
import { generateJWT, verifyJWT } from '@/utils/jwt';
import { EmailVerificationTokenPayload } from '@bes/types/instance';

if (!env.bes.instance_email_verification_secret) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    'Missing BES instance email verification secret',
    true,
  );
}

if (!env.bes.instance_email_verification_expires_in) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    'Missing BES instance email verification expires in',
    true,
  );
}

export const generateInstanceEmailVerificationToken = (instanceId: string) => {
  const payload: EmailVerificationTokenPayload = {
    action: 'verify-email',
    instance: instanceId,
  };

  return generateJWT(
    payload,
    env.bes.instance_email_verification_secret ?? '',
    env.bes.instance_email_verification_expires_in ?? '',
  );
};

export const verifyInstanceEmailVerificationToken = (token: string) => {
  return verifyJWT<EmailVerificationTokenPayload>(
    token,
    env.bes.instance_email_verification_secret ?? '',
  );
};
