import crypto from 'crypto';

export const hmac = (key: string, data: string): string => {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
};
