const mongoose = require('mongoose');

require('dotenv').config();

const NX_APPLICATION_MONGO_URI = process.env.NX_APPLICATION_MONGO_URI;

const applicationDB = mongoose.createConnection(NX_APPLICATION_MONGO_URI);
applicationDB.on('error', console.error.bind(console, 'connection error:'));
applicationDB.once('open', () => {
  console.log('Connected to application database');
});

module.exports = { applicationDB };
