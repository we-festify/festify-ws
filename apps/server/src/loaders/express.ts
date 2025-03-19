import * as express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from '../config';
import helmet from 'helmet';
import compression from 'compression';
import { AppError, CommonErrors, handler } from '../utils/errors';
import api from '../api';
import { logger } from '../utils/logger';
import { isCelebrateError } from 'celebrate';
import * as useragent from 'express-useragent';
import { UserAgentMiddleware } from '../api/middlewares/user-agent';

const expressLoader = async ({ app }: { app: express.Application }) => {
  app.set('trust proxy', 'loopback, linklocal, uniquelocal');

  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  app.head('/health', (req, res) => {
    res.status(200).end();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Enable CORS for the client app
  logger.info(`CORS enabled for ${env.client.url}`);
  app.use(cors({ origin: env.client.url, credentials: true }));
  // Set security headers
  app.use(helmet());
  // Compress response bodies for all requests
  // to reduce the network latency and bandwidth usage
  app.use(compression());
  // Parse user-agent header
  app.use(useragent.express());
  const userAgentMiddleware = new UserAgentMiddleware();
  app.use(userAgentMiddleware.extractDeviceInfo);

  app.get('/device', (req, res) => {
    res.json({
      browser: req.useragent?.browser,
      os: req.useragent?.os,
      platform: req.useragent?.platform,
      source: req.useragent?.source,
    });
  });

  // Request logging
  if (env.nodeEnv === 'development') {
    app.use((req, _res, next) => {
      logger.http(`${req.method} ${req.url}`);
      next();
    });
  }

  // Load all routes
  app.use('/v1', api);

  // Catch 404 and forward to error handler
  app.all('*', (req, res, next) => {
    next(
      new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        `Can't ${req.method} ${req.originalUrl}, route not found`,
      ),
    );
  });

  // Error handling
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (isCelebrateError(err)) {
        return handler.handleError(
          new AppError(
            CommonErrors.BadRequest.name,
            CommonErrors.BadRequest.statusCode,
            err.details.get('body')?.message ??
              'Something went wrong while validating your request',
          ),
          res,
        );
      }

      handler.handleError(err, res);
    },
  );
};

export default expressLoader;
