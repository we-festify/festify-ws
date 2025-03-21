import { ChartType } from '@sharedtypes/analog/charts';

export const ChartTypes: Record<string, ChartType> = {
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie',
} as const;

export const ChartDropAllowedTypes: Record<
  ChartType,
  {
    x: string[];
    y: string[];
    xLabel?: string;
    yLabel?: string;
  }
> = {
  bar: {
    x: ['field-datetime', 'field-ref'],
    y: ['field-number'],
  },
  pie: {
    x: ['field-ref'],
    y: ['field-number'],
    xLabel: 'Category',
    yLabel: 'Value',
  },
  line: {
    x: ['field-number', 'field-datetime'],
    y: ['field-number'],
  },
} as const;
