export type PrimitiveAnalogType = 'number' | 'string' | 'datetime';
export type RefAnalogType = 'ref';
export type AnalogFieldType = PrimitiveAnalogType | RefAnalogType;

export interface PrimitiveField {
  key: string;
  type: PrimitiveAnalogType;
}

export interface ReferenceField {
  key: string;
  type: RefAnalogType;
  ref: string;
}

export type AnalogField = PrimitiveField | ReferenceField;

export interface AnalogSchema {
  name: string;
  fields: AnalogField[];
}
