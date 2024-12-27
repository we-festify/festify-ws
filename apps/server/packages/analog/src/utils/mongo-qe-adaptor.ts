import { AppError, CommonErrors } from '@/utils/errors';
import { IQueryEngineAdaptor } from '@analog/types/utils/qe-adaptor';
import mongoose from 'mongoose';

export class MongoQEAdaptor implements IQueryEngineAdaptor {
  private readonly endpoint: string;
  private readonly client: mongoose.Connection;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.client = mongoose.createConnection(this.endpoint);
  }

  async connect(): Promise<void> {
    if (this.client.readyState === 1) return;
    await this.client.openUri(this.endpoint);
  }

  async disconnect(): Promise<void> {
    if (!this.client) return;
    await this.client.close();
  }

  async query(q: {
    x: { table: string; column: string };
    y: { table: string; column: string };
  }): Promise<{ x: unknown[]; y: unknown[] }> {
    if (!this.client)
      throw new AppError(
        CommonErrors.InternalServerError.name,
        CommonErrors.InternalServerError.statusCode,
        'Analog Mongo QE Adaptor is not connected',
        true,
      );

    const { x, y } = q;
    if (!x || !y || !x.table || !x.column || !y.table || !y.column) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Invalid query',
        true,
      );
    }

    if (x.table !== y.table) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Invalid query: x and y tables must be the same',
        true,
      );
    }

    const model = this.client.model(x.table);
    if (!model) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        `Model ${x.table} not found`,
        true,
      );
    }

    const query = generateQueryForSameModel({ x: x.column, y: y.column });
    const result = await model.aggregate(query).exec();

    return {
      x: result.map((r) => r[x.column]),
      y: result.map((r) => r[y.column]),
    };
  }
}

const generateQueryForSameModel = ({ x, y }: { x: string; y: string }) => {
  return [
    {
      $lookup: {
        from: x,
        localField: '_id',
        foreignField: '_id',
        as: x,
      },
    },
    {
      $project: {
        [x]: 1,
        [y]: 1,
      },
    },
  ];
};

export default MongoQEAdaptor;
