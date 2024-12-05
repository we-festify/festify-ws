import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { validateFRN } from '@/utils/frn';
import { ACTIONS } from '@aim/constants/actions';
import PermissionPolicy from '@aim/models/permission-policy';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import Joi from 'joi';
import { Model } from 'mongoose';

export const validator: ValidatorFunction<null, unknown> = (_, data) => {
  const dataSchema = Joi.object().keys({
    policy: Joi.object().keys({
      alias: Joi.string().required().min(3).max(50),
      description: Joi.string().required().min(3).max(100),
      rules: Joi.array()
        .items(
          Joi.object().keys({
            effect: Joi.string().valid('allow', 'deny').required(),
            service: Joi.string().required(),
            actions: Joi.array()
              .items(
                Joi.string().valid(...ACTIONS.map((action) => action.alias)),
              )
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
        )
        .required(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return !dataError;
};

const handlerWithoutDeps =
  (
    permissionPolicyModel: Model<IPermissionPolicy>,
  ): HandlerFunction<
    null,
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
  async (_resource, data, context) => {
    const { accountId } = context.user;
    const { policy } = data;

    const existingPolicy = await permissionPolicyModel.findOne({
      account: accountId,
      alias: policy.alias,
    });
    if (existingPolicy) {
      throw new AppError(
        CommonErrors.Conflict.name,
        CommonErrors.Conflict.statusCode,
        'Policy with this alias already exists',
      );
    }

    await permissionPolicyModel.create({
      ...policy,
      account: accountId,
    });
  };

const handler = handlerWithoutDeps(PermissionPolicy);

export const name = 'CreatePolicy';
export default handler;
