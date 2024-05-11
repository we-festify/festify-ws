const cryptoJS = require("crypto-js");

const generateRandomString = (length) => {
  return cryptoJS.lib.WordArray.random(length).toString();
};

const encrypt = (text) => {
  const secret = generateRandomString(16);
  const encrypted = cryptoJS.AES.encrypt(text, secret).toString();
  const randomKey = generateRandomString(16);
  return `${randomKey}${encrypted}${secret}`;
};

const decrypt = (text) => {
  const secret = text.slice(-16);
  const encrypted = text.slice(16, -16);
  return cryptoJS.AES.decrypt(encrypted, secret).toString(cryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt,
};
