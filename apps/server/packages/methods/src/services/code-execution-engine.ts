import ivm from 'isolated-vm';

export class CodeExecutionEngine {
  private isolate: ivm.Isolate;
  private context: ivm.Context;
  private jail: ivm.Reference;
  private timeout: number;

  constructor({
    memoryLimit,
    timeout,
  }: {
    memoryLimit: number;
    timeout: number;
  }) {
    this.isolate = new ivm.Isolate({ memoryLimit });
    this.context = this.isolate.createContextSync();
    this.jail = this.context.global;
    this.timeout = timeout;
  }

  private async createWrapperForNodeJs(code: string) {
    return `${code}
    
(async (event) => {
    const value = await main(event);
    return JSON.stringify(value);
})`;
  }

  public async execute(code: string, event: unknown) {
    const wrappedCode = await this.createWrapperForNodeJs(code);

    const executableFunction = await this.context.eval(wrappedCode, {
      reference: true,
    });

    const startTime = Date.now();
    const response = await executableFunction.apply(
      undefined,
      [new ivm.ExternalCopy(event).copyInto()],
      { result: { promise: true }, timeout: this.timeout },
    );

    return {
      result: JSON.parse(`${response}`),
      metadata: {
        memoryUsed: this.isolate.getHeapStatisticsSync().total_heap_size,
        execTime: Date.now() - startTime,
      },
    };
  }
}
