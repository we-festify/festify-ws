import { AnalogFieldType } from '@sharedtypes/analog';

export const cast = (value: unknown, type: AnalogFieldType = 'number') => {
  switch (type) {
    case 'string':
      return value as unknown as string;
    case 'number':
      return Number(value);
    default:
      throw new Error(`Invalid type: ${type}`);
  }
};
