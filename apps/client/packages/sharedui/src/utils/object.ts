import lodash from 'lodash';

export const get = (
  object: Record<string, unknown>,
  path: string,
  defaultValue?: unknown,
) => {
  return lodash.get(object, path, defaultValue);
};

export const set = (
  object: Record<string, unknown>,
  path: string,
  value: unknown,
) => {
  const newObj = {};
  lodash.merge(newObj, object);
  lodash.set(newObj, path, value);
  return newObj;
};

export const merge = (
  object: Record<string, unknown>,
  ...sources: Record<string, unknown>[]
) => {
  const newObj = {};
  lodash.merge(newObj, object, ...sources);
  return newObj;
};

export function update(
  object: Record<string, unknown>,
  updates: Record<string, unknown>,
) {
  const updatesObj = {};
  for (const [key, value] of Object.entries(updates))
    lodash.set(updatesObj, key, value);
  return lodash.merge(object, updatesObj);
}
