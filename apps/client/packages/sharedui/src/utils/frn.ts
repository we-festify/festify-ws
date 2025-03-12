export const readableFRN = (frn: string): string => {
  // frn:bes:account:resource:id
  const [prefix, service, , resource, id] = frn.split(':');

  return `${prefix}:${service}::${resource}:${id}`;
};

export const generateFRN = (
  service?: string | null,
  account?: string | null,
  resourceType?: string | null,
  resourceId?: string | null,
): string => {
  return `frn:${service ?? ''}:${account ?? ''}:${resourceType ?? ''}:${resourceId ?? ''}`;
};
