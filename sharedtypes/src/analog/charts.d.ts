export interface BarChartMetadata extends Record<string, unknown> {
  type: 'bar';
}

export interface LineChartMetadata extends Record<string, unknown> {
  type: 'line';
}

export interface PieChartMetadata extends Record<string, unknown> {
  type: 'pie';
}

export type ChartMetadata =
  | BarChartMetadata
  | LineChartMetadata
  | PieChartMetadata;
