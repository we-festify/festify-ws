import { celebrate, Joi, Segments } from 'celebrate';

export class EmailTemplateValidators {
  public validateGetEmailTemplateById = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
  });

  public validateCreateEmailTemplate = celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      subject: Joi.string().required(),
      body: Joi.string().required(),
    }),
  });

  public validateUpdateEmailTemplate = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string(),
      subject: Joi.string(),
      body: Joi.string(),
    }),
  });

  public validateDeleteEmailTemplates = celebrate({
    [Segments.BODY]: Joi.object().keys({
      ids: Joi.array().items(Joi.string()).required(),
    }),
  });
}
