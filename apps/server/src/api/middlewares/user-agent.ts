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
      const ipInfo = await fetchIPaddressInfo(req.ip || 'unknown');
      req.ipInfo = ipInfo;
      next();
    } catch (_err) {
      errorLogger.error('IP fetch error');
      // ignore error
      next();
    }
  }
}
