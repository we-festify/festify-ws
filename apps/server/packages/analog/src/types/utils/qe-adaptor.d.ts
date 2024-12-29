import { IFilterGroup } from '@sharedtypes/analog';

export interface IQueryEngineAdaptor {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query(
    query: {
      x: { table: string; column: string };
      y: { table: string; column: string };
      filterGroups?: IFilterGroup[];
    },
    { account }: { account: string },
  ): Promise<{
    x: unknown[];
    y: unknown[];
  }>;
}
