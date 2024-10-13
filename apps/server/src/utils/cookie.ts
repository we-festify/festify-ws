import { env } from '../config';
import { AppError, CommonErrors } from './errors';
import crypto from 'crypto'; // Add this line to import the 'crypto' module

export const encryptCookieValue = async (secret: string): Promise<string> => {
  const key = env.general.security.cookieEncryptionSecret;
  if (!key) {
    throw new AppError(
      CommonErrors.InternalServerError.name,
      CommonErrors.InternalServerError.statusCode,
      'Encryption secret for 2FA TOTP not found',
      false,
    );
  }
  const derivedKey = crypto.scryptSync(key, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);
  let encrypted = cipher.update(secret, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  encrypted = `${iv.toString('hex')}:${encrypted}`;
  return encrypted;
};

export const decryptCookieValue = async (
  encrypted: string,
): Promise<string> => {
  const key = env.general.security.cookieEncryptionSecret;
  if (!key) {
    throw new AppError(
      CommonErrors.InternalServerError.name,
      CommonErrors.InternalServerError.statusCode,
      'Encryption secret for 2FA TOTP not found',
      false,
    );
  }
  const derivedKey = crypto.scryptSync(key, 'salt', 32);
  const [iv, encryptedText] = encrypted.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    derivedKey,
    Buffer.from(iv, 'hex'),
  );
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
