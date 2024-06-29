const { applicationDB } = require('../config/db');

// models
const Service = require('@shared/models/Service')(applicationDB);

// data
const allServicesWithDocs = require('../config/services');
const allServicesWithoutDocs = allServicesWithDocs.map((s) => ({
  ...s,
  methods: undefined,
}));

// utils
const { BadRequestError, NotFoundError } = require('../utils/errors');

class ServicesController {
  static async getMyServices(req, res, next) {
    try {
      const services = await Service.find({ user: req.user.userId });
      res.status(200).json({ services });
    } catch (err) {
      next(err);
    }
  }

  static async getAllAvailableServicesMeta(req, res, next) {
    try {
      res.status(200).json({ services: allServicesWithoutDocs });
    } catch (err) {
      next(err);
    }
  }

  static async getServiceMetaByType(req, res, next) {
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

  static async enableService(req, res, next) {
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
      ).fullName;
      res.status(200).json({
        message: `${serviceName} enabled successfully.`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ServicesController;
