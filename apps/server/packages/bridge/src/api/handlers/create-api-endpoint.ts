import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { parseFRN, validateFRNForServiceAndResourceType } from '@/utils/frn';
import BridgeApi from '@bridge/models/bridge-api';
import BridgeApiEndpoint from '@bridge/models/bridge-api-endpoint';
import {
  BridgeApiEndpointMethod,
  IBridgeApi,
  IBridgeApiEndpoint,
} from '@sharedtypes/bridge';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, unknown> = (
  resource,
  data,
) => {
  const isValidResource = validateFRNForServiceAndResourceType(
    resource,
    'bridge',
    'api',
  );

  const dataSchema = Joi.object().keys({
    endpoint: Joi.object().keys({
      path: Joi.string().required(),
      method: Joi.valid(...Object.values(BridgeApiEndpointMethod)).required(),
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
        .required(),
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
        .required(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

const handlerWithoutDeps =
  (
    apiModel: Model<IBridgeApi>,
    endpointModel: Model<IBridgeApiEndpoint>,
  ): HandlerFunction<string, { endpoint: Partial<IBridgeApiEndpoint> }> =>
  async (resource, data, context) => {
    const { accountId } = context.user;
    const { endpoint } = data;
    const { resourceId: alias } = parseFRN(resource);

    const foundApi = await apiModel
      .findOne({
        account: accountId,
        alias,
      })
      .select('_id');
    if (!foundApi) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'API not found',
      );
    }

    const existingEndpoint = await endpointModel.findOne({
      account: accountId,
      api: foundApi._id,
      path: endpoint.path,
      method: endpoint.method,
    });
    if (existingEndpoint) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'Endpoint with the same path and method already exists',
      );
    }

    await endpointModel.create({
      ...endpoint,
      account: accountId,
      api: foundApi._id,
    });
  };

const handler = handlerWithoutDeps(BridgeApi, BridgeApiEndpoint);

export const name = 'CreateApiEndpoint';
export default handler;
