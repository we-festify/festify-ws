import * as e from 'express';
import { fetchIPaddressInfo } from '../../utils/user-agent';
import { errorLogger } from '../../utils/logger';

export class UserAgentMiddleware {
  constructor() {}

  public extractDeviceInfo(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const deviceInfo = {
        browser: req.useragent?.browser || 'unknown',
        os: req.useragent?.os || 'unknown',
        platform: req.useragent?.platform || 'unknown',
        source: req.useragent?.source || 'unknown',
      };

      req.deviceInfo = deviceInfo;
      next();
    } catch (err) {
      next(err);
    }
  }

  public async extractIpInfo(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      console.log('req.ip', req.ip);
      console.log('req.socket.remoteAddress', req.socket.remoteAddress);
      console.log('req.x-forwarded-for', req.headers['x-forwarded-for']);
      const ipInfo = await fetchIPaddressInfo(req.ip || 'unknown');
      const defaultIpInfo = {
        ip: 'unknown',
        location: {
          country: 'unknown',
          state: 'unknown',
          city: 'unknown',
          zip: 'unknown',
          timezone: 'unknown',
        },
      };
      req.ipInfo = {
        ...defaultIpInfo,
        ...(ipInfo || {}),
        location: {
          ...defaultIpInfo.location,
          ...(ipInfo?.location || {}),
        },
      };
      next();
    } catch (_err) {
      errorLogger.error('IP fetch error');
      // ignore error
      next();
    }
  }
}
