export type BESDocsNavItemType = {
  title: string;
  path?: string;
  children?: {
    title: string;
    path?: string;
  }[];
};

export type BESDocsNavType = BESDocsNavItemType[];
