export type HandlerEventType = 'bridge' | 'test';

export interface IHandlerBridgeEvent {
  type: 'bridge';
  headers: Record<string, string>;
  body: string;
}

export interface IHandlerTestEvent {
  type: 'test';
  payload: string;
}

export type HandlerEvent = IHandlerBridgeEvent | IHandlerTestEvent;

export interface IInvokeHandlerResponse {
  result: any;
  metadata: {
    initTime: number;
    execTime: number;
    totalTime: number;
    memoryUsed: number;
  };
}
