import cryptoJS from 'crypto-js';

const { BES_PASSWORD_SECRET } = process.env;

export const encrypt = (text: string) => {
  return cryptoJS.AES.encrypt(text, BES_PASSWORD_SECRET || '').toString();
};

export const decrypt = (text: string) => {
  return cryptoJS.AES.decrypt(text, BES_PASSWORD_SECRET || '').toString(
    cryptoJS.enc.Utf8
  );
};
