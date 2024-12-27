import { AnalogField } from '@sharedtypes/analog';
import { EChartsOption } from 'echarts/types/dist/shared';

export type ChartType = 'bar' | 'pie' | 'line';

export interface IFilter extends Record<string, unknown> {
  collection: string;
  field: string;
  operator: string;
  value: string;
}

export interface IFilterGroup extends Record<string, unknown> {
  filters: IFilter[];
}

export interface IChartMetadata extends Record<string, unknown> {
  type: ChartType;
  xAxis?: {
    collection?: string;
    field?: AnalogField;
  };
  yAxis?: {
    collection?: string;
    field?: AnalogField;
  };
  option?: Partial<EChartsOption>;
  filterGroups?: string[];
}

export interface BarChartMetadata extends IChartMetadata {
  type: 'bar';
}

export interface LineChartMetadata extends IChartMetadata {
  type: 'line';
}

export interface PieChartMetadata extends IChartMetadata {
  type: 'pie';
}
