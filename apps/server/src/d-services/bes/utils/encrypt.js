const cryptoJS = require("crypto-js");

const encrypt = (text) => {
  const secret = process.env.BES_PASSWORD_SECRET;
  return cryptoJS.AES.encrypt(text, secret).toString();
};

/**
 *
 * @param {string} text
 * @returns
 */
const decrypt = (text) => {
  const secret = process.env.BES_PASSWORD_SECRET;
  return cryptoJS.AES.decrypt(text, secret).toString(cryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt,
};
