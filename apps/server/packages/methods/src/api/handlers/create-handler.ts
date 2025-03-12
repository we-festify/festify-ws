import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { convertToSHA256 } from '@/utils/crypto';
import MethodsHandler from '@methods/models/handler';
import {
  IMethodsHandler,
  MethodsHandlerRuntime,
} from '@sharedtypes/methods/handler';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, unknown> = (_r, data) => {
  const dataSchema = Joi.object({
    handler: Joi.object({
      alias: Joi.string().required(),
      description: Joi.string().min(0).required(),
      timeoutInSeconds: Joi.number().required(),
      memoryInMB: Joi.number().required(),
      codeSource: Joi.string().max(5000).required(),
      runtime: Joi.string()
        .valid(...Object.values(MethodsHandlerRuntime))
        .required(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return !dataError;
};

const handlerWithoutDeps =
  (
    methodsHandlerModel: Model<IMethodsHandler>,
  ): HandlerFunction<null, { handler: Partial<IMethodsHandler> }> =>
  async (_resource, data, context) => {
    const { accountId } = context.user;
    const { handler } = data;

    // codeSource is hashed to prevent manipulation
    const hash = convertToSHA256(handler.codeSource ?? '');

    const sizeInBytes = Buffer.byteLength(handler.codeSource ?? '', 'utf8');

    await methodsHandlerModel.create({
      ...handler,
      codeHash: hash,
      codeSizeInBytes: sizeInBytes,
      account: accountId,
    });
  };

const handler = handlerWithoutDeps(MethodsHandler);

export const name = 'CreateHandler';
export default handler;
