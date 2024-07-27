import * as dotenv from 'dotenv';
dotenv.config({ path: './apps/server/.env' });

const besConfig = {
  BASE_URL: process.env.BES_BASE_URL,
};

import besCreator from '../docs/bes';
const bes = besCreator(besConfig);

const services = [bes];

export default services;
