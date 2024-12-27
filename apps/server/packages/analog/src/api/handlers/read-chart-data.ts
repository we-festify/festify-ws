import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import Joi from 'joi';

export const validator: ValidatorFunction<null, unknown> = (_, data) => {
  const dataSchema = Joi.object().keys({
    type: Joi.string().required(),
    xAxis: Joi.object().keys({
      collection: Joi.string().required(),
      field: Joi.string().required(),
    }),
    yAxis: Joi.object().keys({
      collection: Joi.string().required(),
      field: Joi.string().required(),
    }),
  });
  const { error: dataError } = dataSchema.validate(data);

  return !dataError;
};

const handlerWithoutDeps =
  (): HandlerFunction<
    null,
    {
      type: string;
      xAxis: { collection: string; field: string };
      yAxis: { collection: string; field: string };
    }
  > =>
  async (_r, _data, _context) => {
    return {
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        data: [120, 200, 150, 80, 70, 110, 130],
      },
    };
  };

const handler = handlerWithoutDeps();

export const name = 'ReadChartData';
export default handler;
