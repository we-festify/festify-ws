export type DocNavItem = {
  title: string;
  path?: string;
  children?: DocNavItem[];
};

export type IDocsNav = DocNavItem[];
