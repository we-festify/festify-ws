import { IMethodsHandler } from '@sharedtypes/methods/handler';
import { Model } from 'mongoose';
import { CodeExecutionEngine } from './code-execution-engine';
import { HandlerEvent } from '@sharedtypes/methods';
import { parseFRN } from '@/utils/frn';
import { AppError, CommonErrors } from '@/utils/errors';
import { IInvokeHandlerResponse } from '@sharedtypes/methods';

export class InvokeHandlerService {
  constructor(private readonly methodsHandlerModel: Model<IMethodsHandler>) {}

  public async invoke(
    frn: string,
    event: HandlerEvent,
  ): Promise<IInvokeHandlerResponse> {
    const startTime = Date.now();
    const { accountId, resourceId: handlerAlias } = parseFRN(frn);
    const handler = await this.methodsHandlerModel
      .findOne({
        account: accountId,
        alias: handlerAlias,
      })
      .select('codeSource timeoutInSeconds memoryInMB');
    if (!handler) {
      throw new AppError(
        CommonErrors.NotFound.name,
        CommonErrors.NotFound.statusCode,
        `Handler with alias ${handlerAlias} not found`,
      );
    }

    const { codeSource, timeoutInSeconds, memoryInMB } = handler;

    const codeExecutionEngine = new CodeExecutionEngine({
      memoryLimit: memoryInMB,
      timeout: timeoutInSeconds * 1000,
    });

    const initTime = Date.now() - startTime;
    const { result, metadata } = await codeExecutionEngine.execute(
      codeSource,
      event,
    );
    return {
      result,
      metadata: {
        ...metadata,
        initTime,
        totalTime: Date.now() - startTime,
      },
    };
  }
}
