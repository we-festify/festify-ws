import { ChartType } from '@analog-ui/types/charts';

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
    x: [`metric-ref`],
    y: [`metric-number`],
  },
  pie: {
    x: [`metric-ref`],
    y: [`metric-number`],
    xLabel: `Category`,
    yLabel: `Value`,
  },
  line: {
    x: [`metric-ref`],
    y: [`metric-number`],
  },
} as const;
