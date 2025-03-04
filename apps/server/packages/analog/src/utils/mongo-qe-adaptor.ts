import { cast } from '@/utils/cast';
import { AppError, CommonErrors } from '@/utils/errors';
import { IQueryEngineAdaptor } from '@analog/types/utils/qe-adaptor';
import { IFilter, IFilterGroup } from '@sharedtypes/analog';
import { MongoClient } from 'mongodb';
import { PipelineStage } from 'mongoose';

export class MongoQEAdaptor implements IQueryEngineAdaptor {
  private readonly endpoint: string;
  private readonly client: MongoClient;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.client = new MongoClient(endpoint);
  }

  async connect(): Promise<void> {
    if (!this.client) return;
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    if (!this.client) return;
    await this.client.close();
  }

  async query(
    q: {
      x: { table: string; column: string };
      y: { table: string; column: string };
      filterGroups?: IFilterGroup[];
    },
    { account }: { account: string },
  ): Promise<{ x: unknown[]; y: unknown[] }> {
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

    if (x.column === y.column) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Invalid query: x and y columns must be different',
        true,
      );
    }

    if (q.filterGroups) {
      for (const filterGroup of q.filterGroups) {
        for (const filter of filterGroup.filters) {
          if (
            !filter.collection ||
            !filter.field ||
            !filter.operator ||
            !filter.value
          ) {
            throw new AppError(
              CommonErrors.BadRequest.name,
              CommonErrors.BadRequest.statusCode,
              'Invalid query: filter must have collection, field, operator, and value',
              true,
            );
          }

          if (filter.collection !== x.table) {
            throw new AppError(
              CommonErrors.BadRequest.name,
              CommonErrors.BadRequest.statusCode,
              'Invalid query: currently only supports filters on the same table as x and y',
              true,
            );
          }
        }
      }
    }

    const model = this.client.db().collection(x.table.toLowerCase());
    if (!model) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        `Model ${x.table} not found`,
        true,
      );
    }

    const query = this.generateQuery({
      x: x.column,
      y: y.column,
      filterGroups: q.filterGroups,
      account,
    });
    console.log('Query:', JSON.stringify(query, null, 2));
    const result = await model.aggregate(query).toArray();

    return {
      x: result.map((r) => r.x),
      y: result.map((r) => r.y),
    };
  }

  private generateQuery({
    x,
    y,
    filterGroups,
    account,
  }: {
    x: string;
    y: string;
    filterGroups?: IFilterGroup[];
    account: string;
  }): PipelineStage[] {
    if (!account) {
      throw new AppError(
        CommonErrors.BadRequest.name,
        CommonErrors.BadRequest.statusCode,
        'Invalid query: account is required',
        true,
      );
    }

    const query: PipelineStage[] = [
      {
        $match: {
          [x]: { $exists: true },
          [y]: { $exists: true },
          account, // only return data for the account
        },
      },
    ];

    if (filterGroups) {
      // OR of filter groups
      const orQueryStages: Record<string, unknown>[] = [];
      for (const filterGroup of filterGroups) {
        orQueryStages.push(...this.generateQueryForFilterGroup(filterGroup));
      }

      if (orQueryStages.length > 0)
        query.push({ $match: { $or: orQueryStages } });
    }

    query.push({ $sort: { [x]: 1 } });
    // aggregate by value of x
    query.push({
      $group: {
        _id: `$${x}`,
        [x]: { $first: `$${x}` },
        [y]: { $first: `$${y}` },
      },
    });
    query.push({ $limit: 1000 });
    query.push(...this.generateQueryForProjection({ x, y }));

    return query;
  }

  private generateQueryForProjection({
    x,
    y,
  }: {
    x: string;
    y: string;
  }): PipelineStage[] {
    return [{ $project: { x: `$${x}`, y: `$${y}` } }];
  }

  private generateQueryForFilterGroup(
    filterGroup: IFilterGroup,
  ): Record<string, unknown>[] {
    const query: Record<string, unknown>[] = [];

    if (filterGroup.filters) {
      // AND of filters
      const andQueryStages: Record<string, unknown>[] = [];
      for (const filter of filterGroup.filters) {
        andQueryStages.push(...this.generateQueryForFilter(filter));
      }

      if (andQueryStages.length > 0) query.push({ $and: andQueryStages });
    }

    return query;
  }

  private generateQueryForFilter(filter: IFilter): Record<string, unknown>[] {
    const { field, operator, value } = filter;

    switch (operator) {
      case 'eq':
        return [{ [field.key]: value }];
      case 'ne':
        return [{ [field.key]: { $ne: cast(value, field.type) } }];
      case 'gt':
        return [{ [field.key]: { $gt: cast(value, field.type) } }];
      case 'gte':
        return [{ [field.key]: { $gte: cast(value, field.type) } }];
      case 'lt':
        return [{ [field.key]: { $lt: cast(value, field.type) } }];
      case 'lte':
        return [{ [field.key]: { $lte: cast(value, field.type) } }];
      case 'in':
        return [
          {
            [field.key]: {
              $in: value.split(',').map((v) => cast(v, field.type)),
            },
          },
        ];
      case 'sw':
        return [{ [field.key]: { $regex: `^${value}`, $options: 'i' } }];
      case 'ew':
        return [{ [field.key]: { $regex: `${value}$`, $options: 'i' } }];
      case 'contains':
        // for array
        return [{ [field.key]: { $in: [value] } }];
      case 'inR': {
        // in range
        const [min, max] = value.split(',');
        return [
          {
            [field.key]: {
              $gte: cast(min, field.type),
              $lte: cast(max, field.type),
            },
          },
        ];
      }
      case 'ninR': {
        // not in range
        const [min, max] = value.split(',');
        return [
          { [field.key]: { $lt: cast(min, field.type) } },
          { [field.key]: { $gt: cast(max, field.type) } },
        ];
      }
      case 'regex':
        return [{ [field.key]: { $regex: value, $options: 'i' } }];

      default:
        throw new AppError(
          CommonErrors.BadRequest.name,
          CommonErrors.BadRequest.statusCode,
          `Invalid operator: ${operator}`,
          true,
        );
    }
  }
}

export default MongoQEAdaptor;
