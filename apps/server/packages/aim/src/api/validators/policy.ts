import { celebrate, Joi, Segments } from 'celebrate';
import { validateFRN } from '@/utils/frn';
import { ACTIONS } from '@aim/constants/actions';

const policyRuleSchema = Joi.object().keys({
  effect: Joi.string().valid('allow', 'deny').required(),
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
});

export class PolicyValidators {
  public validateCreatePolicy = celebrate({
    [Segments.BODY]: Joi.object().keys({
      alias: Joi.string().required().min(3).max(50),
      description: Joi.string().required().min(3).max(100),
      rules: Joi.array().items(policyRuleSchema).required(),
    }),
  });

  public validateUpdatePolicy = celebrate({
    [Segments.BODY]: Joi.object().keys({
      alias: Joi.string().min(3).max(50),
      description: Joi.string().min(3).max(100),
      rules: Joi.array().items(policyRuleSchema),
    }),
  });

  public validateDeletePolicies = celebrate({
    [Segments.BODY]: Joi.object().keys({
      policyIds: Joi.array().items(Joi.string()).required(),
    }),
  });

  public validateAttachUsersToPolicy = celebrate({
    [Segments.BODY]: Joi.object().keys({
      userIds: Joi.array().items(Joi.string()).required(),
    }),
  });

  public validateDetachUsersFromPolicy = celebrate({
    [Segments.BODY]: Joi.object().keys({
      userIds: Joi.array().items(Joi.string()).required(),
    }),
  });
}
