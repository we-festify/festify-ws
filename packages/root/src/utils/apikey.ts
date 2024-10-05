import cryptoJS from 'crypto-js';

export const createApiKey = () => {
  return cryptoJS.lib.WordArray.random(16).toString();
};
