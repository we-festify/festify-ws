import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import MethodsHandler from '@methods/models/handler';
import { IMethodsHandler } from '@sharedtypes/methods/handler';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string[], null> = (
  resource,
  _data,
) => {
  const isValidResource = resource.every((r) =>
    validateFRNForServiceAndResourceType(r, 'methods', 'handler'),
  );
  return isValidResource;
};

const handlerWithoutDeps =
  (
    methodsHandlerModel: Model<IMethodsHandler>,
  ): HandlerFunction<string[], null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const methodsHandlerAliases = resource.map((r) => parseFRN(r).resourceId);

    const foundHandlers = await methodsHandlerModel.find({
      account: accountId,
      alias: { $in: methodsHandlerAliases },
    });
    if (foundHandlers.length !== methodsHandlerAliases.length) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'One or more handlers not found',
      );
    }

    await methodsHandlerModel.deleteMany({
      account: accountId,
      alias: { $in: methodsHandlerAliases },
    });
  };

const handler = handlerWithoutDeps(MethodsHandler);

export const name = 'DeleteHandlers';
export default handler;
