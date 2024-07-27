import { Response, NextFunction } from 'express';
import { applicationDB } from '../../../config/db';

// models
import BESInstanceCreator from '../models/BESInstance';
const BESInstance = BESInstanceCreator(applicationDB);

// utils
import { createApiKey } from '../../../utils/apikey';
import { BadRequestError, NotFoundError } from '../../../utils/errors';

// middlewares
import { RequestWithUser } from '../../../middlewares/auth';
import { validateInstanceData } from '../utils/instance';
import { encrypt } from '../utils/encrypt';
import validator from 'validator';

class InstancesController {
  static async getInstances(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { rootAccountId } = req.user;

      const instances = await BESInstance.find({
        account: rootAccountId,
      });

      res.status(200).json({ instances });
    } catch (err) {
      next(err);
    }
  }

  static async getInstanceById(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { instanceId } = req.params;
      if (!instanceId) {
        throw new BadRequestError('Instance ID is required');
      }

      const { rootAccountId } = req.user;
      const instance = await BESInstance.findOne({
        account: rootAccountId,
        _id: instanceId,
      });
      if (!instance) {
        throw new NotFoundError('Instance not found');
      }

      res.status(200).json({ instance });
    } catch (err) {
      next(err);
    }
  }

  static async getInstanceByAlias(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { alias } = req.params;
      if (!alias) {
        throw new BadRequestError('Instance alias is required');
      }

      const { rootAccountId } = req.user;
      const instance = await BESInstance.findOne({
        account: rootAccountId,
        alias,
      });
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
      const { rootAccountId } = req.user;

      let {
        alias,
        senderName,
        senderEmail,
        senderPassword,
        smtpHost,
        smtpPort,
      } = req.body;

      // converting to strings for safe query
      alias = alias?.toString().trim();
      senderName = senderName?.toString().trim();
      senderEmail = senderEmail?.toString().trim();
      senderPassword = senderPassword?.toString().trim();
      smtpHost = smtpHost?.toString().trim();
      smtpPort = Number(smtpPort);

      // validations
      validateInstanceData({
        alias,
        senderName,
        senderEmail,
        senderPassword,
      });

      const existingInstance = await BESInstance.findOne({
        account: rootAccountId,
        alias,
      });
      if (existingInstance) {
        throw new BadRequestError('Instance with this alias already exists');
      }

      // secure instance data
      senderPassword = encrypt(senderPassword);

      // generate API key
      const apiKey = createApiKey();

      const instance = new BESInstance({
        account: rootAccountId,
        alias,
        senderName,
        senderEmail,
        senderPassword,
        smtpHost: smtpHost || 'smtp.ethereal.email',
        smtpPort: smtpPort || 587,
        apiKey,
      });
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
      const { instanceId } = req.params;
      if (!instanceId) {
        throw new BadRequestError('Service type and instance ID are required');
      }

      const { rootAccountId } = req.user;

      const instance = await BESInstance.findOne({
        account: rootAccountId,
        _id: instanceId,
      });
      if (!instance) {
        throw new NotFoundError('Instance not found');
      }

      // to only update the fields that are allowed
      let {
        alias,
        status,
        senderName,
        senderEmail,
        senderPassword,
        smtpHost,
        smtpPort,
      } = req.body;

      // converting to strings for safe query
      alias = alias?.toString().trim();
      status = status?.toString().trim();
      senderName = senderName?.toString().trim();
      senderEmail = senderEmail?.toString().trim();
      senderPassword = senderPassword?.toString().trim();
      smtpHost = smtpHost?.toString().trim();
      smtpPort = Number(smtpPort);

      if (senderEmail && !validator.isEmail(senderEmail)) {
        throw new BadRequestError('Invalid email');
      }

      if (senderPassword && senderPassword !== instance.senderPassword) {
        // secure instance data
        // only encrypt if password is changed
        senderPassword = encrypt(senderPassword);
      }

      instance.alias = alias || instance.alias;
      instance.status = status || instance.status;
      instance.senderName = senderName || instance.senderName;
      instance.senderEmail = senderEmail || instance.senderEmail;
      instance.senderPassword = senderPassword || instance.senderPassword;
      instance.smtpHost = smtpHost || instance.smtpHost;
      instance.smtpPort = smtpPort || instance.smtpPort;

      await instance.save();

      res.status(200).json({ message: 'Instance updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async deleteInstances(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { instanceIds } = req.body;
      if (!instanceIds || !instanceIds.length) {
        throw new BadRequestError('Instance IDs are required');
      }

      const { rootAccountId } = req.user;

      await BESInstance.deleteMany({
        account: rootAccountId,
        _id: { $in: instanceIds },
      });

      res.status(200).json({ message: 'Instances deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default InstancesController;
