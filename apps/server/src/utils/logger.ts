import { env } from '@/config';
import winston from 'winston';
import { AppError, CommonErrors } from './errors';
const { colorize, combine, timestamp, printf, json } = winston.format;
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

const sourceToken = env.logs.betterstack.sourceToken;
if (!sourceToken) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    'Log tail source token is missing in the environment variables',
    true,
  );
}
const logtail = new Logtail(sourceToken);

// General logger
const logger = winston.createLogger({
  level: 'silly',
  format: combine(
    colorize(),
    timestamp(),
    printf(({ message, timestamp, level }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

// Auth logger
const authLogger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: 'logs/auth.log' }),
    new LogtailTransport(logtail),
  ],
});

// Error logger
const errorLogger = winston.createLogger({
  level: 'error',
  format: combine(timestamp(), json()),
  transports: [new winston.transports.File({ filename: 'logs/error.log' })],
});

if (process.env.NODE_ENV !== 'production') {
  errorLogger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        printf(({ message, timestamp, level }) => {
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
  );
}

export { logger, authLogger, errorLogger };
