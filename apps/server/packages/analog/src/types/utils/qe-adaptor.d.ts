export interface IQueryEngineAdaptor {
  connect(): void;
  disconnect(): void;
  query(query: {
    x: { table: string; column: string };
    y: { table: string; column: string };
  }): Promise<{
    x: unknown[];
    y: unknown[];
  }>;
}
