// required for building the app
import { env } from './config';
if (env.nodeEnv === 'production') {
  console.log('mode', env.nodeEnv);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('module-alias/register');
}

import express from 'express';
import initLoaders from './loaders';
import { handler } from './utils/errors';
import { logger } from './utils/logger';

async function startServer() {
  const app = express();

  // initialize loaders
  await initLoaders({ expressApp: app });

  app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
  });
}

process.on('unhandledRejection', (reason, _promise) => {
  // We already have a handler for uncaughtException, so let's throw the error
  throw reason;
});

process.on('uncaughtException', (err) => {
  handler.handleError(err, null);
  if (!handler.isTrustedError(err)) {
    // Close the server and exit the process
    process.exit(1);
  }
});

startServer();
