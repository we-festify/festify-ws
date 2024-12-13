import { DocsNavItem } from '@sharedtypes/docs';

export const getSecondHeadingsFromMD = (source: string) => {
  const regex = /^## (.*)/gm;
  const matches = [];
  let match;

  while ((match = regex.exec(source))) {
    matches.push(match[1]);
  }

  return matches;
};

export const getNearestPath = (item: DocsNavItem): string => {
  if (item.path) return item.path;
  for (const child of item.children || []) {
    const path = getNearestPath(child);
    if (path) return path;
  }
  return '';
};
