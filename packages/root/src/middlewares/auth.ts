import { Request, Response, NextFunction } from 'express';

// utils
import { UnauthorizedError } from '../utils/errors';
import { AccessTokenPayloadType, verifyAccessToken } from '../utils/token';

export type RequestWithUser = Request & {
  user: AccessTokenPayloadType;
};

export const requireAuth = (
  req: RequestWithUser,
  _: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError('Unauthorized');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
      throw new UnauthorizedError('Unauthorized');
    }
    const payload = verifyAccessToken(token);

    if (!payload) {
      throw new UnauthorizedError('Unauthorized');
    }

    req.user = payload as AccessTokenPayloadType & { userId: string };
    next();
  } catch (err) {
    return next(err);
  }
};
