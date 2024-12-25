export type PrimitiveAnalogType = 'number' | 'string' | 'datetime';
export type RefAnalogType = 'ref';
export type AnalogMetricType = PrimitiveAnalogType | RefAnalogType;

export interface PrimitiveMetric {
  key: string;
  type: PrimitiveAnalogType;
}

export interface RefMetric {
  key: string;
  type: RefAnalogType;
  ref: string;
}

export type AnalogMetric = PrimitiveMetric | RefMetric;

export interface AnalogSchema {
  name: string;
  metrics: AnalogMetric[];
}
