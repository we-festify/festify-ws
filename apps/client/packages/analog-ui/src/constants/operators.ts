import { OperatorType } from '@analog-ui/types/operators';
import { AnalogFieldType } from '@sharedtypes/analog';

export const OPERATORS: Record<
  string,
  {
    label: string;
    value: OperatorType;
  }
> = {
  EQUALS: { label: 'Equals', value: 'eq' },
  NOT_EQUALS: { label: 'Not Equals', value: 'ne' },
  LESS_THAN: { label: 'Less Than', value: 'lt' },
  LESS_THAN_OR_EQUAL: { label: 'Less Than or Equal', value: 'lte' },
  GREATER_THAN: { label: 'Greater Than', value: 'gt' },
  GREATER_THAN_OR_EQUAL: { label: 'Greater Than or Equal', value: 'gte' },
  IN: { label: 'In', value: 'in' },
  CONTAINS: { label: 'Contains', value: 'contains' },
  IN_RANGE: { label: 'In Range', value: 'inR' },
  NOT_IN_RANGE: { label: 'Not In Range', value: 'ninR' },
  STARTS_WITH: { label: 'Starts With', value: 'sw' },
  ENDS_WITH: { label: 'Ends With', value: 'ew' },
  REGEX: { label: 'Regex', value: 'regex' },
} as const;

export const OPERATORS_BY_FIELD_TYPE: Record<
  AnalogFieldType,
  {
    label: string;
    value: OperatorType;
  }[]
> = {
  string: [
    OPERATORS.EQUALS,
    OPERATORS.NOT_EQUALS,
    OPERATORS.STARTS_WITH,
    OPERATORS.ENDS_WITH,
    OPERATORS.REGEX,
  ],
  number: [
    OPERATORS.EQUALS,
    OPERATORS.NOT_EQUALS,
    OPERATORS.LESS_THAN,
    OPERATORS.LESS_THAN_OR_EQUAL,
    OPERATORS.GREATER_THAN,
    OPERATORS.GREATER_THAN_OR_EQUAL,
    OPERATORS.IN,
    OPERATORS.IN_RANGE,
    OPERATORS.NOT_IN_RANGE,
  ],
  datetime: [
    OPERATORS.EQUALS,
    OPERATORS.NOT_EQUALS,
    OPERATORS.LESS_THAN,
    OPERATORS.LESS_THAN_OR_EQUAL,
    OPERATORS.GREATER_THAN,
    OPERATORS.GREATER_THAN_OR_EQUAL,
    OPERATORS.IN_RANGE,
    OPERATORS.NOT_IN_RANGE,
  ],
  ref: [OPERATORS.EQUALS, OPERATORS.NOT_EQUALS, OPERATORS.IN],
} as const;
