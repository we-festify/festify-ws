import { IAccount } from '../auth/account';

export enum MethodsHandlerRuntime {
  NODEJS = 'nodejs',
}

export interface IMethodsHandler {
  _id: string;

  account: string | IAccount;

  alias: string;
  description?: string;
  timeoutInSeconds: number;
  memoryInMB: number;

  codeSource: string;
  runtime: MethodsHandlerRuntime;

  codeHash: string;
  codeSizeInBytes: number;

  createdAt: Date;
  updatedAt: Date;
}
