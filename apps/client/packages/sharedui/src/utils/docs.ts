export const getRootPath = (prefix: string, location: string) => {
  const rootPath = location.split(prefix + '+')[1] || '';
  return rootPath ? rootPath?.split('/')[0] : '';
};
