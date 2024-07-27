import { Request, Response, NextFunction } from 'express';

// data
import allServicesWithDocs from '../config/services';
const allServicesWithoutDocs = allServicesWithDocs.map((s) => ({
  ...s,
  methods: undefined,
}));

// utils
import { BadRequestError, NotFoundError } from '../utils/errors';

// middlewares
import { RequestWithUser } from '../middlewares/auth';

class ServicesController {
  static async getAllAvailableServicesMeta(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      res.status(200).json({ services: allServicesWithoutDocs });
    } catch (err) {
      next(err);
    }
  }

  static async getServiceMetaByType(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { serviceType } = req.params;
      if (!serviceType) {
        throw new BadRequestError('Service type is required');
      }
      const service = allServicesWithDocs.find((s) => s.type === serviceType);
      if (!service) {
        throw new NotFoundError('Service not found');
      }

      const existingService = false;

      const payload = {
        ...service,
        enabled: !!existingService,
        enabledService: existingService,
      };

      res.status(200).json({ service: payload });
    } catch (err) {
      next(err);
    }
  }
}

export default ServicesController;
