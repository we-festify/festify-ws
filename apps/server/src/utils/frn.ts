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

export const validateFRN = (frn: string) => {
  const parts = frn.split(':');
  return (
    parts.length === 5 &&
    parts[0] === 'frn' &&
    parts[1] &&
    parts[2] &&
    parts[3] &&
    parts[4]
  );
};

export const validateFRNForService = (frn: string, service: string) => {
  if (!validateFRN(frn)) {
    return false;
  }
  const { service: frnService } = parseFRN(frn);
  return frnService === service;
};
