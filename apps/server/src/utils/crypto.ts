import crypto from 'crypto';

export const convertToSHA256 = (data: string, unique = true): string => {
  const uniquePayloadString = unique ? `${data}-${new Date().getTime()}` : data;
  return crypto.createHash('sha256').update(uniquePayloadString).digest('hex');
};

export const encryptUsingAES = (text: string, secret: string) => {
  if (!text) return '';
  if (!secret) {
    throw new Error('Secret must be defined');
  }
  const derivedKey = crypto.scryptSync(secret, 'salt', 32);
  const iv = Buffer.from(crypto.randomBytes(16));
  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
};

export const decryptUsingAES = (text: string, secret: string) => {
  if (!text) return '';
  if (!secret) {
    throw new Error('Secret must be defined');
  }
  const derivedKey = crypto.scryptSync(secret, 'salt', 32);
  const [iv, encryptedText, authTag] = text.split(':');
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
