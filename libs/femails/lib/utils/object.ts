import get from 'lodash/get';

// Define a type to infer the return type for a dot-joined path
export type NestedValue<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}` // Check if the path contains a dot
  ? K extends keyof T // Ensure the first part is a valid key
    ? Rest extends string // Ensure the rest is still a string
      ? NestedValue<T[K], Rest> // Recurse for the rest of the path
      : never
    : never
  : P extends keyof T // If no dot, ensure it's a valid key
    ? T[P]
    : never;

export function getNestedValue<T, P extends string>(
  obj: T,
  path: P,
): NestedValue<T, P> {
  return get(obj, path) as NestedValue<T, P>;
}
