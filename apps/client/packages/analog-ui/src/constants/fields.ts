import { AnalogFieldType } from '@sharedtypes/analog';

export const FIELD_TYPES: Record<string, AnalogFieldType> = {
  STRING: 'string',
  NUMBER: 'number',
  DATETIME: 'datetime',
  REFERENCE: 'ref',
} as const;
