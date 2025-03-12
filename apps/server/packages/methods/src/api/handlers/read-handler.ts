import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import MethodsHandler from '@methods/models/handler';
import { IMethodsHandler } from '@sharedtypes/methods/handler';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, null> = (resource) => {
  const isValidResource =
    typeof resource === 'string' &&
    validateFRNForServiceAndResourceType(resource, 'methods', 'handler');

  return isValidResource;
};

const handlerWithoutDeps =
  (
    methodsHandlerModel: Model<IMethodsHandler>,
  ): HandlerFunction<string, null> =>
  async (resource, _data, context) => {
    const { accountId } = context.user;
    const handlerAlias = parseFRN(resource).resourceId;

    const handler = await methodsHandlerModel
      .findOne({
        account: accountId,
        alias: handlerAlias,
      })
      .select('+codeSource');
    if (!handler) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Handler not found',
      );
    }

    return { handler };
  };

const handler = handlerWithoutDeps(MethodsHandler);

export const name = 'ReadHandler';
export default handler;
