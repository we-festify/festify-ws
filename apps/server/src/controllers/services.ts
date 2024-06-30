import { Request, Response, NextFunction } from 'express';
import { applicationDB } from '../config/db';

// models
import ServiceCreator from '@shared/models/Service';
const Service = ServiceCreator(applicationDB);

// data
import allServicesWithDocs from '../config/services';
const allServicesWithoutDocs = allServicesWithDocs.map((s) => ({
  ...s,
  methods: undefined,
}));

// utils
import { BadRequestError, NotFoundError } from '../utils/errors';

// middlewares
import { RequestWithUser } from '@server/middlewares/auth';

class ServicesController {
  static async getMyServices(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const services = await Service.find({ user: req.user.userId });
      res.status(200).json({ services });
    } catch (err) {
      next(err);
    }
  }

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

      const { userId } = req.user;
      const existingService = await Service.findOne({
        user: userId,
        type: serviceType,
      });

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

  static async enableService(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { serviceType } = req.params;
      if (!serviceType) {
        throw new BadRequestError('Service type is required');
      }

      const { userId } = req.user;
      const existingService = await Service.findOne({
        user: userId,
        type: serviceType,
      });

      if (existingService) {
        return res.status(200).json({
          message:
            'Service is already enabled. Please create a new instance to use the service.',
        });
      }

      await Service.create({
        user: userId,
        type: serviceType,
      });

      const serviceName = allServicesWithDocs.find(
        (s) => s.type === serviceType
      )?.fullName;
      res.status(200).json({
        message: `${serviceName} enabled successfully.`,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default ServicesController;
