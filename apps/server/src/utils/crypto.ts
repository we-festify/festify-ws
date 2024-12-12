import crypto from 'crypto';

export const convertToSHA256 = (data: string, unique = true): string => {
  const uniquePayloadString = unique ? `${data}-${new Date().getTime()}` : data;
  return crypto.createHash('sha256').update(uniquePayloadString).digest('hex');
};

const keyCache = new Map();

export const encryptUsingAES = (text: string, secret: string) => {
  if (!text) return '';
  if (!secret) {
    throw new Error('Secret must be defined');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(secret, salt, 32);
  keyCache.set(secret + ':' + salt, derivedKey);

  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${salt}:${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
};

export const decryptUsingAES = (text: string, secret: string) => {
  if (!text) return '';
  if (!secret) {
    throw new Error('Secret must be defined');
  }

  const [salt, iv, encryptedText, authTag] = text.split(':');
  const cacheKey = secret + ':' + (salt ?? 'salt');
  let derivedKey = keyCache.get(cacheKey);
  if (!derivedKey) {
    derivedKey = crypto.scryptSync(secret, salt ?? 'salt', 32);
    keyCache.set(cacheKey, derivedKey);
  }

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    derivedKey,
    Buffer.from(iv, 'hex'),
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const generateRandomString = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};
