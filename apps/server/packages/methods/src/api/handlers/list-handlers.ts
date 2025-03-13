import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import MethodsHandler from '@methods/models/handler';
import { IMethodsHandler } from '@sharedtypes/methods/handler';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, null> = () => true;

const handlerWithoutDeps =
  (methodsHandlerModel: Model<IMethodsHandler>): HandlerFunction<null, null> =>
  async (_resource, _data, context) => {
    const { accountId } = context.user;

    const handlers = await methodsHandlerModel.find({ account: accountId });

    return { handlers };
  };

const handler = handlerWithoutDeps(MethodsHandler);

export const name = 'ListHandlers';
export default handler;
