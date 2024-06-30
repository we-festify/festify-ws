import mongoose from 'mongoose';

import * as dotenv from 'dotenv';
dotenv.config({ path: './apps/server/.env' });

const APPLICATION_MONGO_URI =
  process.env.APPLICATION_MONGO_URI || 'mongodb://localhost:27017/fws';

const applicationDB = mongoose.createConnection(APPLICATION_MONGO_URI);
applicationDB.on('error', console.error.bind(console, 'connection error:'));
applicationDB.once('open', () => {
  console.log('Connected to application database');
});

export { applicationDB };
