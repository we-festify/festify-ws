import { HandlerFunction, ValidatorFunction } from '@/types/handler';
import MethodsHandler from '@methods/models/handler';
import { IMethodsHandler } from '@sharedtypes/methods/handler';
import mongoose, { Model, PipelineStage } from 'mongoose';

export const validator: ValidatorFunction<null, null> = () => true;

interface IMethodsSummaryResponse {
  summary: {
    count: number;
    total: {
      codeSize: number;
      memory: number;
    };
    avg: {
      codeSize: number;
      memory: number;
      timeout: number;
    };
  };
  methodsByRuntime: {
    runtime: string;
    count: number;
  }[];
}

const handlerWithoutDeps =
  (methodsHandlerModel: Model<IMethodsHandler>): HandlerFunction<null, null> =>
  async (_resource, _data, context) => {
    const { accountId } = context.user;

    // First aggregation: Get summary statistics
    const aggregateQuery: PipelineStage[] = [
      { $match: { account: new mongoose.Types.ObjectId(accountId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalCodeSize: { $sum: '$codeSizeInBytes' },
          totalMemory: { $sum: '$memoryInMB' },
          avgCodeSize: { $avg: '$codeSizeInBytes' },
          avgMemory: { $avg: '$memoryInMB' },
          avgTimeout: { $avg: '$timeoutInSeconds' },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          total: { codeSize: '$totalCodeSize', memory: '$totalMemory' },
          avg: {
            codeSize: '$avgCodeSize',
            memory: '$avgMemory',
            timeout: '$avgTimeout',
          },
        },
      },
    ];

    // Second aggregation: Count methods by runtime
    const runtimeQuery: PipelineStage[] = [
      { $match: { account: new mongoose.Types.ObjectId(accountId) } },
      { $group: { _id: '$runtime', count: { $sum: 1 } } },
      { $project: { _id: 0, runtime: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ];

    const [summaryResults, methodsByRuntime] = await Promise.all([
      methodsHandlerModel.aggregate(aggregateQuery).exec(),
      methodsHandlerModel.aggregate(runtimeQuery).exec(),
    ]);

    const summary =
      summaryResults.length > 0
        ? summaryResults[0]
        : {
            count: 0,
            total: { codeSize: 0, memory: 0 },
            avg: { codeSize: 0, memory: 0, timeout: 0 },
          };

    return {
      summary,
      methodsByRuntime,
    } as IMethodsSummaryResponse;
  };

// Create the handler with the dependency injected
const handler = handlerWithoutDeps(MethodsHandler);

export const name = 'ReadSummary';
export default handler;
