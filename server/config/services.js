require("dotenv").config();

const besConfig = {
  BASE_URL: process.env.BES_BASE_URL,
};

const tsConfig = {
  BASE_URL: process.env.TS_BASE_URL,
};

const bes = require("./docs/bes")(besConfig);
const ts = require("./docs/ts")(tsConfig);

const services = [bes, ts];

module.exports = services;
