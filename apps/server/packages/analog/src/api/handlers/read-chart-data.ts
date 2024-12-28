import { env } from '@/config';
import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import { AppError, CommonErrors } from '@/utils/errors';
import { IQueryEngineAdaptor } from '@analog/types/utils/qe-adaptor';
import MongoQEAdaptor from '@analog/utils/mongo-qe-adaptor';
import { IFilterGroup } from '@sharedtypes/analog';
import Joi from 'joi';

const MONGO_URI = env.db.endpoint;
if (!MONGO_URI) {
  throw new AppError(
    CommonErrors.InternalServerError.name,
    CommonErrors.InternalServerError.statusCode,
    'Mongo URI is not set for Analog Mongo QE Adaptor',
    true,
  );
}

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
    filterGroups: Joi.array().items(
      Joi.object().keys({
        filters: Joi.array().items(
          Joi.object().keys({
            collection: Joi.string().required(),
            field: Joi.object().keys({
              key: Joi.string().required(),
              type: Joi.string().required(),
            }),
            operator: Joi.string().required(),
            value: Joi.string().required(),
          }),
        ),
      }),
    ),
  });
  const { error: dataError } = dataSchema.validate(data);

  return !dataError;
};

const handlerWithoutDeps =
  (
    adaptor: IQueryEngineAdaptor,
  ): HandlerFunction<
    null,
    {
      type: string;
      xAxis: { collection: string; field: string };
      yAxis: { collection: string; field: string };
      filterGroups?: IFilterGroup[];
    }
  > =>
  async (_r, data, context) => {
    const { user } = context;

    console.log('ReadChartData', data);
    await adaptor.connect();
    const { x, y } = await adaptor.query(
      {
        x: { table: data.xAxis.collection, column: data.xAxis.field },
        y: { table: data.yAxis.collection, column: data.yAxis.field },
        filterGroups: data.filterGroups,
      },
      { account: user.accountId },
    );

    return {
      xAxis: { data: x },
      yAxis: { data: y },
    };
  };

const handler = handlerWithoutDeps(new MongoQEAdaptor(MONGO_URI));

export const name = 'ReadChartData';
export default handler;
