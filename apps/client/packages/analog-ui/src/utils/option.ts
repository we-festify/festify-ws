import { baseOption } from '@analog-ui/constants/option';
import {
  BarChartMetadata,
  IChartMetadata,
  PieChartMetadata,
} from '@analog-ui/types/charts';
import {
  IBarOptionData,
  IOptionData,
  IPieOptionData,
} from '@analog-ui/types/option';
import { createDeepMergedObject } from '@sharedui/utils/object';
import {
  BarSeriesOption,
  EChartsOption,
  LegendOption,
  PieSeriesOption,
  XAXisOption,
  YAXisOption,
} from 'echarts/types/dist/shared';

export const generateOption = (
  metadata: IChartMetadata,
  data: IOptionData,
): EChartsOption => {
  switch (metadata.type) {
    case 'bar':
      return generateOptionForBarChart(
        metadata as BarChartMetadata,
        data as IBarOptionData,
      );
    case 'pie':
      return generateOptionForPieChart(
        metadata as PieChartMetadata,
        data as IPieOptionData,
      );
    default:
      return {};
  }
};

export const generateOptionForBarChart = (
  metadata: BarChartMetadata,
  data: IBarOptionData,
): EChartsOption => {
  if (!metadata.xAxis || !metadata.yAxis) return {};
  if (!metadata.yAxis.field || !metadata.xAxis.field) return {};
  if (!data.x || !data.y) return {};

  const xAxis: XAXisOption = {
    type: 'category',
    data: data.x,
  };
  const yAxis: YAXisOption = { type: 'value' };
  const series: BarSeriesOption[] = [
    {
      type: 'bar',
      name: metadata.yAxis.field?.key,
      data: data.y,
    },
  ];
  const dataOption = { xAxis, yAxis, series };

  // {} <-- default <-- user customisations <-- data
  const option = createDeepMergedObject(
    {},
    baseOption,
    metadata?.option ?? {},
    dataOption,
  );
  return option;
};

export const generateOptionForPieChart = (
  metadata: PieChartMetadata,
  data: IPieOptionData,
): EChartsOption => {
  if (!metadata.xAxis || !metadata.yAxis) return {};
  if (!metadata.yAxis.field || !metadata.xAxis.field) return {};
  if (!data.x || !data.y) return {};

  const legend: LegendOption = {
    data: data.x.map((d) => d.toString()),
  };
  const series: PieSeriesOption[] = [
    {
      type: 'pie',
      name: metadata.yAxis.field.key,
      radius: '50%',
      data: data.y.map((y, index) => ({
        name: data.x[index] ?? '',
        value: Number(y ?? 0),
      })),
      center: ['50%', '50%'],
    },
  ];
  const dataOption = { legend, series };

  // {} <-- default <-- user customisations <-- data
  const option = createDeepMergedObject(
    {},
    baseOption,
    metadata.option ?? {},
    dataOption,
  );
  return option;
};
