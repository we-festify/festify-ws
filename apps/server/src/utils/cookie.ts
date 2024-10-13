import { env } from '../config';
import { decryptUsingAES, encryptUsingAES } from './crypto';
import { AppError, CommonErrors } from './errors';

export const encryptCookieValue = async (secret: string): Promise<string> => {
  const key = env.general.security.cookieEncryptionSecret;
  if (!key) {
    throw new AppError(
      CommonErrors.InternalServerError.name,
      CommonErrors.InternalServerError.statusCode,
      'Encryption secret for cookie not found',
      false,
    );
  }
  return encryptUsingAES(secret, key);
};

export const decryptCookieValue = async (
  encrypted: string,
): Promise<string> => {
  const key = env.general.security.cookieEncryptionSecret;
  if (!key) {
    throw new AppError(
      CommonErrors.InternalServerError.name,
      CommonErrors.InternalServerError.statusCode,
      'Encryption secret for cookie not found',
      false,
    );
  }
  return decryptUsingAES(encrypted, key);
};
