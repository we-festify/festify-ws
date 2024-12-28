export type OperatorType =
  | 'eq' // equals
  | 'ne' // not equals
  | 'lt' // less than
  | 'lte' // less than or equals
  | 'gt' // greater than
  | 'gte' // greater than or equals
  | 'in' // in
  | 'contains' // for array type fields
  | 'inR' // in range
  | 'ninR' // not in range
  | 'sw' // starts with
  | 'ew' // ends with
  | 'regex'; // regex
