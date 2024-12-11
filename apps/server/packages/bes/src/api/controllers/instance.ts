import * as e from 'express';
import { IInstanceController } from '@bes/types/instance';
import { IBESInstance } from '@sharedtypes/bes';
import { Model } from 'mongoose';
import { AppError, CommonErrors } from '@/utils/errors';
import { verifyInstanceEmailVerificationToken } from '@bes/utils/instance';

export default class InstanceController implements IInstanceController {
  private readonly instanceModel: Model<IBESInstance>;
  constructor(instanceModel: Model<IBESInstance>) {
    this.instanceModel = instanceModel;
  }

  public verifyInstanceEmail = async (
    req: e.Request,
    res: e.Response,
    next: e.NextFunction,
  ): Promise<void> => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== 'string') {
        throw new AppError(
          CommonErrors.BadRequest.name,
          CommonErrors.BadRequest.statusCode,
          `Invalid token`,
        );
      }

      const payload = verifyInstanceEmailVerificationToken(token);
      if (!payload) {
        throw new AppError(
          CommonErrors.BadRequest.name,
          CommonErrors.BadRequest.statusCode,
          `Invalid token`,
        );
      }

      const instance = await this.instanceModel.findById(payload.instance);
      if (!instance) {
        throw new AppError(
          CommonErrors.NotFound.name,
          CommonErrors.NotFound.statusCode,
          `Instance not found`,
        );
      }

      instance.status = 'active';
      await instance.save();

      res.status(200).json({ message: 'Instance verified' });
    } catch (err) {
      next(err);
    }
  };
}
