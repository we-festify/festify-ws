import lodash from 'lodash';

export const get = (
  object: Record<string, unknown> | null | undefined,
  path: string,
  defaultValue?: unknown,
) => {
  if (!object) return defaultValue;
  return lodash.get(object, path, defaultValue);
};

/**
 * Create a new object with the value set at the path
 *
 * @param object - initial object
 * @param path - path to set the value
 * @param value - value to set
 * @returns new object
 */
export const createAndSetValue = (
  object: Record<string, unknown>,
  path: string,
  value: unknown,
) => {
  const newObj = {};
  lodash.merge(newObj, object);
  lodash.set(newObj, path, value);
  return newObj;
};

/**
 * Set the value at the path in the object
 *
 * @param object - object to set the value
 * @param path - path to set the value
 * @param value - value to set
 * @returns void
 */
export const setValue = (
  object: Record<string, unknown>,
  path: string,
  value: unknown,
) => {
  lodash.set(object, path, value);
};

/**
 * Create a new object with all the sources merged into the object
 *
 * @param object - initial object
 * @param sources - objects to merge
 * @returns new object
 */
export const createDeepMergedObject = (
  object: Record<string, unknown>,
  ...sources: Record<string, unknown>[]
) => {
  const newObj = {};
  lodash.merge(newObj, object, ...sources);
  return newObj;
};

/**
 * Merge all the sources into the object
 *
 * @param object - object to merge into
 * @param sources - objects to merge
 * @returns void
 */
export const deepMergeObjects = (
  object: Record<string, unknown>,
  ...sources: Record<string, unknown>[]
) => {
  lodash.merge(object, ...sources);
};

/**
 * Create a new object with all the updates set at the path
 *
 * @param object - initial object
 * @param updates - object with key value pairs to update
 * @returns new object
 */
export function createUpdatedObject(
  object: Record<string, unknown>,
  updates: Record<string, unknown>,
) {
  const updatesObj = {};
  for (const [key, value] of Object.entries(updates))
    lodash.set(updatesObj, key, value);
  return lodash.merge(object, updatesObj);
}
