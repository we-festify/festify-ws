import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { validateFRNForServiceAndResourceType } from '@/utils/frn';
import MethodsHandler from '@methods/models/handler';
import { InvokeHandlerService } from '@methods/services/invoke-handler';
import { HandlerEvent } from '@sharedtypes/methods';
import Joi from 'joi';

export const validator: ValidatorFunction<string, unknown> = (
  resource,
  data,
) => {
  const isValidResource =
    typeof resource === 'string' &&
    validateFRNForServiceAndResourceType(resource, 'methods', 'handler');

  const dataSchema = Joi.object().keys({
    event: Joi.alternatives().try(
      Joi.object().keys({
        type: Joi.string().valid('bridge').required(),
        headers: Joi.object().required(),
        body: Joi.string().required(),
      }),
      Joi.object().keys({
        type: Joi.string().valid('test').required(),
        payload: Joi.string().required(),
      }),
    ),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

const handlerWithoutDeps =
  (
    InvokeHandlerService: InvokeHandlerService,
  ): HandlerFunction<string, { event: HandlerEvent }> =>
  async (resource, data, _context) => {
    const { event } = data;
    const response = await InvokeHandlerService.invoke(resource, event);

    return response;
  };

const handler = handlerWithoutDeps(new InvokeHandlerService(MethodsHandler));

export const name = 'InvokeHandler';
export default handler;
