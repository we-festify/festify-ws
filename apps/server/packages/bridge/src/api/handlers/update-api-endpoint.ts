import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BridgeApiEndpoint from '@bridge/models/bridge-api-endpoint';
import {
  BridgeApiEndpointMethod,
  IBridgeApiEndpoint,
} from '@sharedtypes/bridge';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<[string, string], unknown> = (
  resource,
  data,
) => {
  const isValidResource =
    validateFRNForServiceAndResourceType(resource[0], 'bridge', 'api') &&
    validateFRNForServiceAndResourceType(resource[1], 'bridge', 'endpoint');

  const dataSchema = Joi.object().keys({
    endpoint: Joi.object().keys({
      path: Joi.string().optional(),
      method: Joi.valid(...Object.values(BridgeApiEndpointMethod)).optional(),
      integration: Joi.alternatives()
        .try(
          Joi.object().keys({
            type: Joi.string().valid('http').required(),
            method: Joi.string()
              .valid(...Object.values(BridgeApiEndpointMethod))
              .required(),
            url: Joi.string().uri().required(),
          }),
          Joi.object().keys({
            type: Joi.string().valid('method').required(),
            frn: Joi.string().required(),
          }),
          Joi.object().keys({
            type: Joi.string().valid('mock').required(),
            statusCode: Joi.number().integer().min(100).max(599).required(),
            body: Joi.string().min(0).optional(),
            headers: Joi.object()
              .pattern(Joi.string(), Joi.string())
              .optional(),
          }),
        )
        .optional(),
      policies: Joi.array()
        .items(
          Joi.alternatives().try(
            Joi.object().keys({
              type: Joi.string().valid('rate-limit').required(),
            }),
            Joi.object().keys({
              type: Joi.string().valid('cache').required(),
            }),
          ),
        )
        .optional(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

const handlerWithoutDeps =
  (
    endpointModel: Model<IBridgeApiEndpoint>,
  ): HandlerFunction<
    [string, string],
    { endpoint: Partial<IBridgeApiEndpoint> }
  > =>
  async (resource, data, _context) => {
    const { endpoint } = data;
    const { resourceId: endpointId } = parseFRN(resource[1]);

    await endpointModel.findByIdAndUpdate(endpointId, endpoint);
  };

const handler = handlerWithoutDeps(BridgeApiEndpoint);

export const name = 'UpdateApiEndpoint';
export default handler;
