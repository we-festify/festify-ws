const { applicationDB } = require('../config/db');

// models
const Instance = require('@shared/models/Instance')(applicationDB);

// utils
const { UnauthorizedError } = require('../utils/errors');
const { verifyAccessToken } = require('../utils/token');

const requireAuth = (req, res, next) => {
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

    req.user = payload;
    next();
  } catch (err) {
    return next(err);
  }
};

const requireAuthByAPIKey = async (req, res, next) => {
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

    // check if origin is allowed
    const origin = req.headers.origin;
    const internalAllowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    if (
      instance.allowedOrigins.includes('*') === false &&
      instance.allowedOrigins.length > 0 &&
      !instance.allowedOrigins.includes(origin) &&
      !internalAllowedOrigins.includes(origin)
    ) {
      throw new UnauthorizedError('Unauthorized');
    }

    req.instance = instance;
    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  requireAuth,
  requireAuthByAPIKey,
};
