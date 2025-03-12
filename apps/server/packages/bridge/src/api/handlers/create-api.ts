import { env } from '@/config';
import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import BridgeApi from '@bridge/models/bridge-api';
import BridgeApiEndpoint from '@bridge/models/bridge-api-endpoint';
import { IBridgeApi, IBridgeApiEndpoint } from '@sharedtypes/bridge';
import Joi from 'joi';
import { Model } from 'mongoose';

// Approximately, 36^6 = 2.2 billion apis
const UID_LENGTH = 6;

const generateUniqueId = (length: number): string => {
  if (length <= 0) {
    throw new Error('Length must be a positive number');
  }

  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const getInvokeUrl = (uid: string): string => {
  return `${env.url}/api/v1/d/bridge/invoke/${uid}`;
};

export const validator: ValidatorFunction<null, unknown> = (_, data) => {
  const dataSchema = Joi.object().keys({
    api: Joi.object().keys({
      alias: Joi.string().required(),
      description: Joi.string().min(0).max(500).optional(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return !dataError;
};

const handlerWithoutDeps =
  (
    apiModel: Model<IBridgeApi>,
    endpointModel: Model<IBridgeApiEndpoint>,
  ): HandlerFunction<null, { api: IBridgeApi }> =>
  async (_resource, data, context) => {
    const { accountId } = context.user;
    const { api } = data;

    const existingApi = await apiModel.findOne({
      account: accountId,
      alias: api.alias,
    });
    if (existingApi) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'API with the same alias already exists',
      );
    }

    let uid = generateUniqueId(UID_LENGTH);
    let maxTries = 5;
    do {
      const foundApi = await apiModel.findOne({ uid });
      if (!foundApi) {
        break;
      }
    } while (maxTries-- > 0);

    if (maxTries <= 0) {
      throw new AppError(
        CommonErrors.InternalServerError.name,
        CommonErrors.InternalServerError.statusCode,
        'Failed to create API. Please try again',
      );
    }

    const createdApi = await apiModel.create({
      ...api,
      uid,
      invokeUrl: getInvokeUrl(uid),
      account: accountId,
    });

    await endpointModel.create({
      account: accountId,
      api: createdApi._id,
      method: 'GET',
      path: '/',
      integration: {
        type: 'mock',
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Hello, world!',
      },
    });
  };

const handler = handlerWithoutDeps(BridgeApi, BridgeApiEndpoint);

export const name = 'CreateApi';
export default handler;
