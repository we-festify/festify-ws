import winston from 'winston';
const { colorize, combine, timestamp, printf, json } = winston.format;

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
  transports: [new winston.transports.File({ filename: 'logs/auth.log' })],
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
