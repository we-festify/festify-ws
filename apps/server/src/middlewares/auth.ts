import { Request, Response, NextFunction } from 'express';
import { applicationDB } from '../config/db';

// models
import BESInstanceCreator, {
  BESInstanceDoc,
} from '../d-services/bes/models/BESInstance';
const Instance = BESInstanceCreator(applicationDB);

// utils
import { UnauthorizedError } from '../utils/errors';
import { AccessTokenPayloadType, verifyAccessToken } from '../utils/token';

export type RequestWithUser = Request & {
  user: AccessTokenPayloadType;
};
export type RequestWithInstance = Request & { instance: BESInstanceDoc };

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

export const requireAuthByAPIKey = async (
  req: RequestWithInstance,
  _: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedError('Unauthorized');
    }

    const [type, apiKey] = authorization.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedError('Unauthorized');
    }

    const instance = await Instance.findOne({ apiKey });
    if (!instance || instance.status !== 'active') {
      throw new UnauthorizedError('Unauthorized');
    }

    req.instance = instance;
    next();
  } catch (err) {
    return next(err);
  }
};
