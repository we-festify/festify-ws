import { celebrate, Joi, Segments } from 'celebrate';

export class UserValidators {
  public validateCreateUser = celebrate({
    [Segments.BODY]: Joi.object().keys({
      alias: Joi.string().required(),
      password: Joi.string().required(),
    }),
  });

  public validateUpdateUser = celebrate({
    [Segments.BODY]: Joi.object().keys({
      alias: Joi.string(),
      password: Joi.string(),
    }),
  });

  public validateDeleteUsers = celebrate({
    [Segments.BODY]: Joi.object().keys({
      userIds: Joi.array().items(Joi.string()).required(),
    }),
  });

  public validateAttachPoliciesToUser = celebrate({
    [Segments.BODY]: Joi.object().keys({
      userId: Joi.string().required(),
      policyIds: Joi.array().items(Joi.string()).required(),
    }),
  });

  public validateDetachPoliciesFromUser = celebrate({
    [Segments.BODY]: Joi.object().keys({
      userId: Joi.string().required(),
      policyIds: Joi.array().items(Joi.string()).required(),
    }),
  });
}
