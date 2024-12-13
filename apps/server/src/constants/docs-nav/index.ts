import { IDocsNav } from '@sharedtypes/docs';
import { besDocsNav } from './bes';
import { aimDocsNav } from './aim';

export const docsNav: Record<string, IDocsNav> = {
  bes: besDocsNav,
  aim: aimDocsNav,
  index: [],
};
