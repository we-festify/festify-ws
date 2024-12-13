import { IDocsNav } from '@sharedtypes/docs';
import { besDocsNav } from './bes';
import { aimDocsNav } from './aim';

export const docsNav: Record<
  string,
  {
    nav: IDocsNav;
    meta: {
      title: string;
    };
  }
> = {
  bes: {
    nav: besDocsNav,
    meta: {
      title: 'Festify Basic Email Service',
    },
  },
  aim: {
    nav: aimDocsNav,
    meta: {
      title: 'Festify Access and Identity Management',
    },
  },
};
