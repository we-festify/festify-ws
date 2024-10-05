import { besDocsNav, besDocsAllowedPaths } from './bes';

export const docsNav = {
  bes: {
    nav: besDocsNav,
    allowedPaths: besDocsAllowedPaths,
  },
  index: {
    nav: [],
    allowedPaths: [] as string[],
  },
};

export type DocsServiceType = keyof typeof docsNav;
