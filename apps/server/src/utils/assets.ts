import path from 'path';

export const getPathToAsset = (asset: string) => {
  return path.resolve(__dirname, './src/assets/', asset);
};
