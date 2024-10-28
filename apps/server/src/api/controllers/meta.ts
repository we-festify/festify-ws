import { services } from '@/constants/services';
import { allowedActionsByService } from '@/constants/services/actions';
import * as e from 'express';

export class MetaController {
  public async getServicesMeta(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      res.json({ services });
    } catch (err) {
      next(err);
    }
  }

  public async getAllowedActionsForService(
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ) {
    try {
      const service = req.params.service;
      res.json({ actions: allowedActionsByService[service] });
    } catch (err) {
      next(err);
    }
  }
}
