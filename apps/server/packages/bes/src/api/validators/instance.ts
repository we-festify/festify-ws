import { celebrate, Joi, Segments } from 'celebrate';

export class InstanceValidators {
  public validateGetInstanceById = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
  });

  public validateGetInstanceByAlias = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      alias: Joi.string().required(),
    }),
  });

  public validateCreateInstance = celebrate({
    [Segments.BODY]: Joi.object().keys({
      alias: Joi.string().required(),

      senderName: Joi.string().required(),
      senderEmail: Joi.string().email().required(),
      senderPassword: Joi.string().required(),

      smtpHost: Joi.string().required(),
      smtpPort: Joi.number().required(),
    }),
  });

  public validateUpdateInstance = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      alias: Joi.string(),

      senderName: Joi.string(),
      senderEmail: Joi.string().email(),
      senderPassword: Joi.string(),

      smtpHost: Joi.string(),
      smtpPort: Joi.number(),
    }),
  });

  public validateDeleteInstances = celebrate({
    [Segments.BODY]: Joi.object().keys({
      ids: Joi.array().items(Joi.string()).required(),
    }),
  });
}
