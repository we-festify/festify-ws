import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { convertToSHA256 } from '@/utils/crypto';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import MethodsHandler from '@methods/models/handler';
import { IMethodsHandler } from '@sharedtypes/methods/handler';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, unknown> = (
  resource,
  data,
) => {
  const isValidResource = validateFRNForServiceAndResourceType(
    resource,
    'methods',
    'handler',
  );
  const dataSchema = Joi.object({
    handler: Joi.object({
      alias: Joi.string().optional(),
      description: Joi.string().min(0).optional(),
      timeoutInSeconds: Joi.number().optional(),
      memoryInMB: Joi.number().optional(),
      codeSource: Joi.string().optional(),
      runtime: Joi.string().optional(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

const handlerWithoutDeps =
  (
    methodsHandlerModel: Model<IMethodsHandler>,
  ): HandlerFunction<string, { handler: Partial<IMethodsHandler> }> =>
  async (resource, data, context) => {
    const { accountId } = context.user;
    const { handler } = data;
    const methodsHandlerAlias = parseFRN(resource).resourceId;

    const foundHandler = await methodsHandlerModel.findOne({
      account: accountId,
      alias: methodsHandlerAlias,
    });
    if (!foundHandler) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Handler not found',
      );
    }

    if (handler.alias !== methodsHandlerAlias) {
      const existingHandler = await methodsHandlerModel.findOne({
        account: accountId,
        alias: handler.alias,
      });
      if (existingHandler) {
        throw new AppError(
          CommonErrors.Conflict.name,
          CommonErrors.Conflict.statusCode,
          'Handler with the same alias already exists',
        );
      }
    }

    const hash = handler.codeSource
      ? convertToSHA256(handler.codeSource)
      : undefined;

    const sizeInBytes = handler.codeSource
      ? Buffer.byteLength(handler.codeSource, 'utf8')
      : undefined;

    await methodsHandlerModel.updateOne(
      { account: accountId, alias: methodsHandlerAlias },
      { ...handler, codeHash: hash, codeSizeInBytes: sizeInBytes },
    );
  };

const handler = handlerWithoutDeps(MethodsHandler);

export const name = 'UpdateHandler';
export default handler;
