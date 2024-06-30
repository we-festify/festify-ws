import { Response, NextFunction } from 'express';
import { applicationDB } from '../config/db';

// models
import InstanceCreator from '@shared/models/Instance';
import ServiceCreator from '@shared/models/Service';
import CredsCreator, { CredsDoc } from '@shared/models/Creds';
const Instance = InstanceCreator(applicationDB);
const Service = ServiceCreator(applicationDB);
const Creds = CredsCreator(applicationDB);

// data
import services from '../config/services';

// utils
import { validateCreds, secureCreds } from '../utils/creds';
import { createApiKey } from '../utils/apikey';
import { BadRequestError, NotFoundError } from '../utils/errors';

// middlewares
import { RequestWithUser } from '../middlewares/auth';

class InstancesController {
  static async getInstances(
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
      const service = await Service.findOne({
        user: userId,
        type: serviceType,
      });
      if (!service) {
        const serviceName = services.find(
          (s) => s.type === serviceType
        )?.fullName;
        throw new NotFoundError(`${serviceName} not enabled`);
      }

      const instances = await Instance.find({
        user: userId,
        service: service._id,
      });

      res.status(200).json({ instances });
    } catch (err) {
      next(err);
    }
  }

  static async getInstance(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { serviceType, instanceId } = req.params;
      if (!serviceType || !instanceId) {
        throw new BadRequestError('Service type and instance ID are required');
      }

      const { userId } = req.user;
      const service = await Service.findOne({
        user: userId,
        type: serviceType,
      });
      if (!service) {
        const serviceName = services.find(
          (s) => s.type === serviceType
        )?.fullName;
        throw new NotFoundError(`${serviceName} not enabled`);
      }

      const instance = await Instance.findOne({
        user: userId,
        service: service._id,
        _id: instanceId,
      }).populate('service creds');
      if (!instance) {
        throw new NotFoundError('Instance not found');
      }

      res.status(200).json({ instance });
    } catch (err) {
      next(err);
    }
  }

  static async createInstance(
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
      const service = await Service.findOne({
        user: userId,
        type: serviceType,
      });
      if (!service) {
        const serviceName = services.find(
          (s) => s.type === serviceType
        )?.fullName;
        return res.status(404).json({ message: `${serviceName} not enabled` });
      }

      let { name } = req.body;

      if (!name) {
        throw new BadRequestError('Instance name is required');
      }

      // converting to strings for safe query
      name = name?.toString();

      const existingInstance = await Instance.findOne({
        user: userId,
        service: service._id,
        name,
      });
      if (existingInstance) {
        throw new BadRequestError('Instance with this name already exists');
      }

      const credsObject = {
        type: serviceType,
        ...req.body,
      };
      const isValidCreds = validateCreds(credsObject);
      if (isValidCreds !== true) {
        throw new BadRequestError(
          isValidCreds || 'Invalid credentials for service type'
        );
      }
      const secureCredsObject = secureCreds(credsObject);
      const creds = new Creds(secureCredsObject);

      const apiKey = createApiKey();

      const instance = new Instance({
        service: service._id,
        user: userId,
        creds: creds._id,
        apiKey,
        name,
      });

      creds.instance = instance._id;
      await creds.save();
      await instance.save();

      res.status(201).json({ message: 'Instance created successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async updateInstance(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { serviceType, instanceId } = req.params;
      if (!serviceType || !instanceId) {
        throw new BadRequestError('Service type and instance ID are required');
      }

      const { userId } = req.user;
      const service = await Service.findOne({
        user: userId,
        type: serviceType,
      });
      if (!service) {
        const serviceName = services.find(
          (s) => s.type === serviceType
        )?.fullName;
        throw new NotFoundError(`${serviceName} not enabled`);
      }

      const instance = await Instance.findOne({
        user: userId,
        service: service._id,
        _id: instanceId,
      });
      if (!instance) {
        throw new NotFoundError('Instance not found');
      }

      // to only update the fields that are allowed
      let { name, status, allowedOrigins } = req.body;

      // converting to strings for safe query
      name = name?.toString();
      status = status?.toString();
      allowedOrigins = allowedOrigins?.map((origin: string) =>
        origin.toString().trim()
      );

      if (name) {
        instance.name = name;
      }
      if (status) {
        instance.status = status;
      }
      if (allowedOrigins) {
        instance.allowedOrigins = allowedOrigins;
      }

      await instance.save();

      res.status(200).json({ message: 'Instance updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async updateCreds(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { serviceType, instanceId } = req.params;
      if (!serviceType || !instanceId) {
        throw new BadRequestError('Service type and instance ID are required');
      }

      const { userId } = req.user;
      const service = await Service.findOne({
        user: userId,
        type: serviceType,
      });
      if (!service) {
        const serviceName = services.find(
          (s) => s.type === serviceType
        )?.fullName;
        throw new NotFoundError(`${serviceName} not enabled`);
      }

      const instance = await Instance.findOne({
        user: userId,
        service: service._id,
        _id: instanceId,
      }).populate('creds');
      if (!instance) {
        throw new NotFoundError('Instance not found');
      }

      const data = req.body;

      const credsObject = {
        smtpHost: 'smtp.ethereal.email',
        smtpPort: 587,
        ...data,
        type: serviceType,
      };
      const isValidCreds = validateCreds(credsObject);
      if (isValidCreds !== true) {
        throw new BadRequestError(
          isValidCreds || 'Invalid credentials for service type'
        );
      }
      const secureCredsObject = secureCreds(credsObject);
      Object.assign(instance.creds, secureCredsObject);
      await (instance.creds as unknown as CredsDoc).save();

      res.status(200).json({ message: 'Credentials updated successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default InstancesController;
