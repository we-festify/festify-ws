export interface IBlock {
  id: string;
  attributes: Record<string, unknown>;
  children?: IBlock[] | string;
}
