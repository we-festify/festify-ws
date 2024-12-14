export type DocsNavItem = {
  /** title to be displayed */
  title: string;
  /** path to the file containing the content */
  path?: string;
  /** children of the current item */
  children?: DocsNavItem[];
};

export type IDocsNav = DocsNavItem[];
