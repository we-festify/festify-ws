const { applicationDB } = require("../config/db");
const { BadRequestError } = require("../utils/errors");

// models
const Instance = require("../models/Instance")(applicationDB);
const Service = require("../models/Service")(applicationDB);
const Creds = require("../models/Creds")(applicationDB);

// data
const services = require("../config/services");
const { validateCreds, secureCreds } = require("../utils/creds");
const { createApiKey } = require("../utils/apikey");

class InstancesController {
  static async getInstances(req, res, next) {
    try {
      const { serviceType } = req.params;
      if (!serviceType) {
        throw new BadRequestError("Service type is required");
      }

      const { userId } = req.user;
      const service = await Service.findOne({
        user: userId,
        type: serviceType,
      });
      if (!service) {
        const serviceName = services.find(
          (s) => s.type === serviceType
        ).fullName;
        return res.status(404).json({ message: `${serviceName} not enabled` });
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

  static async getInstance(req, res, next) {
    try {
      const { serviceType, instanceId } = req.params;
      if (!serviceType || !instanceId) {
        throw new BadRequestError("Service type and instance ID are required");
      }

      const { userId } = req.user;
      const service = await Service.findOne({
        user: userId,
        type: serviceType,
      });
      if (!service) {
        const serviceName = services.find(
          (s) => s.type === serviceType
        ).fullName;
        return res.status(404).json({ message: `${serviceName} not enabled` });
      }

      const instance = await Instance.findOne({
        user: userId,
        service: service._id,
        _id: instanceId,
      }).populate("service creds");
      if (!instance) {
        return res.status(404).json({ message: "Instance not found" });
      }

      res.status(200).json({ instance });
    } catch (err) {
      next(err);
    }
  }

  static async createInstance(req, res, next) {
    try {
      const { serviceType } = req.params;
      if (!serviceType) {
        throw new BadRequestError("Service type is required");
      }

      const { userId } = req.user;
      const service = await Service.findOne({
        user: userId,
        type: serviceType,
      });
      if (!service) {
        const serviceName = services.find(
          (s) => s.type === serviceType
        ).fullName;
        return res.status(404).json({ message: `${serviceName} not enabled` });
      }

      const { name } = req.body;
      if (!name) {
        throw new BadRequestError("Instance name is required");
      }
      const existingInstance = await Instance.findOne({
        user: userId,
        service: service._id,
        name,
      });
      if (existingInstance) {
        throw new BadRequestError("Instance with this name already exists");
      }

      const credsObject = {
        type: serviceType,
        ...req.body,
      };
      const isValidCreds = validateCreds(credsObject);
      if (isValidCreds !== true) {
        throw new BadRequestError(
          isValidCreds || "Invalid credentials for service type"
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

      res.status(201).json({ message: "Instance created successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async updateCreds(req, res, next) {
    try {
      const { serviceType, instanceId } = req.params;
      if (!serviceType || !instanceId) {
        throw new BadRequestError("Service type and instance ID are required");
      }

      const { userId } = req.user;
      const service = await Service.findOne({
        user: userId,
        type: serviceType,
      });
      if (!service) {
        const serviceName = services.find(
          (s) => s.type === serviceType
        ).fullName;
        return res.status(404).json({ message: `${serviceName} not enabled` });
      }

      const instance = await Instance.findOne({
        user: userId,
        service: service._id,
        _id: instanceId,
      }).populate("creds");
      if (!instance) {
        return res.status(404).json({ message: "Instance not found" });
      }

      const credsObject = {
        type: serviceType,
        ...req.body,
      };
      const isValidCreds = validateCreds(credsObject);
      if (isValidCreds !== true) {
        throw new BadRequestError(
          isValidCreds || "Invalid credentials for service type"
        );
      }
      const secureCredsObject = secureCreds(credsObject);
      Object.assign(instance.creds, secureCredsObject);
      await instance.creds.save();

      res.status(200).json({ message: "Credentials updated successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InstancesController;
