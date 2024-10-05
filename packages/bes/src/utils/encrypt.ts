import cryptoJS from 'crypto-js';

const { BES_PASSWORD_SECRET } = process.env;

if (!BES_PASSWORD_SECRET) {
  throw new Error('BES_PASSWORD_SECRET must be defined');
}

export const encrypt = (text: string) => {
  if (!text) return '';
  return cryptoJS.AES.encrypt(text, BES_PASSWORD_SECRET || '').toString();
};

export const decrypt = (text: string) => {
  if (!text) return '';
  return cryptoJS.AES.decrypt(text, BES_PASSWORD_SECRET || '').toString(
    cryptoJS.enc.Utf8
  );
};
