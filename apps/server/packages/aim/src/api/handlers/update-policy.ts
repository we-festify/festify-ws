import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import {
  parseFRN,
  validateFRN,
  validateFRNForServiceAndResourceType,
} from '@/utils/frn';
import { ACTIONS } from '@aim/constants/actions';
import PermissionPolicy from '@aim/models/permission-policy';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<string, unknown> = (
  resource,
  data,
) => {
  const isValidResource = validateFRNForServiceAndResourceType(
    resource,
    'aim',
    'policy',
  );

  const dataSchema = Joi.object().keys({
    policy: Joi.object().keys({
      alias: Joi.string().min(3).max(50),
      description: Joi.string().min(3).max(100),
      rules: Joi.array().items(
        Joi.object().keys({
          effect: Joi.string().valid('allow', 'deny').required(),
          service: Joi.string().required(),
          actions: Joi.array()
            .items(Joi.string().valid(...ACTIONS.map((action) => action.alias)))
            .required()
            .min(1),
          resources: Joi.array()
            .items(
              Joi.string().custom((value, helpers) => {
                if (!validateFRN(value)) {
                  return helpers.error('any.invalid');
                }
                return value;
              }),
            )
            .required(),
        }),
      ),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return isValidResource && !dataError;
};

const handlerWithoutDeps =
  (
    permissionPolicyModel: Model<IPermissionPolicy>,
  ): HandlerFunction<
    string,
    {
      policy: {
        alias: string;
        description: string;
        rules: {
          effect: string;
          service: string;
          actions: string[];
          resources: string[];
        }[];
      };
    }
  > =>
  async (resource, data, context) => {
    const { accountId } = context.user;
    const { policy } = data;
    const { resourceId: alias } = parseFRN(resource);

    const foundPolicy = await permissionPolicyModel.findOne({
      account: accountId,
      alias,
    });
    if (!foundPolicy) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        'Policy not found',
      );
    }

    await permissionPolicyModel.findOneAndUpdate(
      { account: accountId, alias },
      { ...policy },
      { new: true },
    );
  };

const handler = handlerWithoutDeps(PermissionPolicy);

export const name = 'UpdatePolicy';
export default handler;
