export interface ChartConfigSectionStringProperty
  extends Record<string, unknown> {
  label: string;
  type: 'string';
  key: string;
  default?: string;
}

export interface ChartConfigSectionEnumProperty
  extends Record<string, unknown> {
  label: string;
  type: 'enum';
  key: string;
  options: string[];
  default: string;
}

export interface ChartConfigSectionBooleanProperty
  extends Record<string, unknown> {
  label: string;
  type: 'boolean';
  key: string;
  default: boolean;
}

export interface ChartConfigSectionDirectionProperty
  extends Record<string, unknown> {
  label: string;
  type: 'direction';
  /** [horizontal, vertical] */
  key: [string, string];
  /** [left, center, right], [top, center, bottom] */
  options: [[string, string, string], [string, string, string]];
  /** [horizontal, vertical] */
  default: [string, string];
}

export type ChartConfigSectionProperty =
  | ChartConfigSectionStringProperty
  | ChartConfigSectionEnumProperty
  | ChartConfigSectionBooleanProperty
  | ChartConfigSectionDirectionProperty;

export interface ChartConfigSection {
  title: string;
  properties: ChartConfigSectionProperty[];
}
