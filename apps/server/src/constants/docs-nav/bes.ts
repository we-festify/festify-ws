import { IDocsNav } from '@sharedtypes/docs';

export const besDocsNav: IDocsNav = [
  {
    title: 'User Guide',
    children: [
      {
        title: 'Welcome',
        path: 'userguide/welcome',
      },
      {
        title: 'Getting Started',
        path: 'userguide/getting-started/index',
      },
    ],
  },
  {
    title: 'API Reference',
    path: 'api-reference',
  },
  {
    title: 'FAQs',
    path: 'faqs',
  },
];
