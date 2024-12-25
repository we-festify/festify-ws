import { IChartMetadata } from '@analog-ui/types/charts';

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

  metadata: IChartMetadata;
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

  metadata: {
    something: string;
  };
}

export type ITile = IChartTile | IFilterTile;
