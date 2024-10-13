import rateLimit from 'express-rate-limit';
import { AppError, CommonErrors } from '../../utils/errors';

export class RateLimiterMiddleware {
  public limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: () => {
      throw new AppError(
        CommonErrors.TooManyRequests.name,
        CommonErrors.TooManyRequests.statusCode,
        'You have exceeded maximum number of requests. Please try again after 15 minutes',
      );
    },
  });

  public emailLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    handler: () => {
      throw new AppError(
        CommonErrors.TooManyRequests.name,
        CommonErrors.TooManyRequests.statusCode,
        'You have exceeded maximum number of requests. Please try again after some time',
      );
    },
  });
}
