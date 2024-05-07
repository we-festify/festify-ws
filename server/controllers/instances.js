const { applicationDB } = require("../config/db");
const { BadRequestError } = require("../utils/errors");

// models
const Instance = require("../models/Instance")(applicationDB);
const Service = require("../models/Service")(applicationDB);

// data
const services = require("../config/services");

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
      const serviceName = services.find((s) => s.type === serviceType).fullName;
      if (!service) {
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
}

module.exports = InstancesController;
