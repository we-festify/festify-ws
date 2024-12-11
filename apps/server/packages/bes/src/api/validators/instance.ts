import { IInstanceValidators } from '@bes/types/instance';
import { celebrate, Joi, Segments } from 'celebrate';

export class InstanceValidators implements IInstanceValidators {
  public verifyInstanceEmail = celebrate({
    [Segments.QUERY]: {
      token: Joi.string().required(),
    },
  });
}
