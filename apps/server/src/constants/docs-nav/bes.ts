import { IDocsNav } from '@sharedtypes/docs';

export const besDocsNav: IDocsNav = [
  {
    title: 'User Guide',
    children: [
      {
        title: 'Welcome',
        path: 'user-guide/welcome',
      },
      {
        title: 'Getting Started',
        path: 'user-guide/getting-started/index',
        children: [
          {
            title: 'Setting up',
            path: 'user-guide/getting-started/setting-up',
          },
        ],
      },
    ],
  },
  {
    title: 'API Reference',
    path: 'api-reference/index',
    children: [
      {
        title: 'Actions',
        children: [
          {
            title: 'SendEmail',
            path: 'api-reference/actions/send-email',
          },
        ],
      },
    ],
  },
  {
    title: 'FAQs',
    path: 'faqs',
  },
];
