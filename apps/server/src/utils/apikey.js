const cryptoJS = require("crypto-js");

const createApiKey = () => {
  return cryptoJS.lib.WordArray.random(16).toString();
};

module.exports = { createApiKey };
