const path = require('path');

export const getPathToAsset = (asset) => {
  return path.resolve(__dirname, './src/assets/', asset);
};
