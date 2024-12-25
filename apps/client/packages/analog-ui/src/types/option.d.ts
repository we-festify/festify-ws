export interface IOptionData extends Record<string, unknown> {
  x: (string | number)[];
  y: (string | number)[];
}

export type IBarOptionData = IOptionData;

export interface IPieOptionData extends IOptionData {
  x: string[];
  y: number[];
}
