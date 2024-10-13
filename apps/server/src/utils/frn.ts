export const generateFRN = (
  service: string,
  accountId: string,
  resourceType: string,
  resourceId: string,
) => {
  return `frn:${service}:${accountId}:${resourceType}:${resourceId}`;
};

export const parseFRN = (frn: string) => {
  const [, service, accountId, resourceType, resourceId] = frn.split(':');
  return { service, accountId, resourceType, resourceId };
};

export const validateFRN = (frn: string) =>
  /^frn:([a-z0-9]{2,4}-){2,4}[a-z0-9]{2,4}$/.test(frn);

export const validateFRNForService = (frn: string, service: string) =>
  new RegExp(`^frn:${service}:[a-z0-9]{2,4}:[a-z0-9]{2,4}$`).test(frn);
