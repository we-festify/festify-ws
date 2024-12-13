export type DocsNavItem = {
  title: string;
  path?: string;
  children?: DocsNavItem[];
};

export type IDocsNav = DocsNavItem[];
