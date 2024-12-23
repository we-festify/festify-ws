import { ChartMetadata } from './charts';

export interface ICanvas extends Record<string, unknown> {
  _id: string;
  name: string;

  tiles: string[];
}

export interface IChartTile extends Record<string, unknown> {
  _id: string;
  type: 'chart';

  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };

  metadata: ChartMetadata;
}

export interface IFilterTile extends Record<string, unknown> {
  _id: string;
  type: 'filter';

  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };

  metadata: {};
}

export type ITile = IChartTile | IFilterTile;
