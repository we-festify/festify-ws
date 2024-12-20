export const readableFRN = (frn: string): string => {
  // frn:bes:account:resource:id
  const [prefix, service, , resource, id] = frn.split(':');

  return `${prefix}:${service}::${resource}:${id}`;
};

export const generateFRN = (
  service: string,
  account: string,
  resourceType: string,
  resourceId: string,
): string => {
  return `frn:${service}:${account}:${resourceType}:${resourceId}`;
};
