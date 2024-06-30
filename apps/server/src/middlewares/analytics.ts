import { Response, NextFunction } from 'express';
// db
import { applicationDB } from '../config/db';

// models
import InstanceCreator from '@shared/models/Instance';
const Instance = InstanceCreator(applicationDB);

// utils
import { NotFoundError } from '../utils/errors';

// middlewares
import { RequestWithInstance } from './auth';

export const trackApiRequest = async (
  req: RequestWithInstance,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.instance;

    // instance will always be there
    // already checked in requireAuthByAPIKey middleware
    const instance = await Instance.findById(_id);

    if (!instance) {
      // this should never happen
      // but if it does, we should throw an error
      throw new NotFoundError('Instance not found');
    }

    // update instance last api call time and increment api calls
    instance.lastApiCallTime = new Date();
    instance.apiCalls += 1;
    await instance.save();

    next();
  } catch (err) {
    next(err);
  }
};
