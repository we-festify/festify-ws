import { AnalogMetric } from '@sharedtypes/analog';
import { EChartsOption } from 'echarts/types/dist/shared';

export type ChartType = 'bar' | 'pie' | 'line';

export interface IChartMetadata extends Record<string, unknown> {
  type: ChartType;
  xAxis: {
    collection: string;
    metric: AnalogMetric;
  };
  yAxis: {
    collection: string;
    metric: AnalogMetric;
  };
  option: Partial<EChartsOption>;
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
