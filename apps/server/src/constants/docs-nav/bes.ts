import { IDocsNav } from '@sharedtypes/docs';

export const besDocsNav: IDocsNav = [
  {
    title: 'User Guide',
    children: [
      {
        title: 'Welcome',
        path: 'bes/user-guide/welcome',
      },
      {
        title: 'Getting Started',
        path: 'bes/user-guide/getting-started/index',
        children: [
          {
            title: 'Setting up',
            path: 'bes/user-guide/getting-started/setting-up',
          },
        ],
      },
    ],
  },
  {
    title: 'API Reference',
    path: 'bes/api-reference/index',
    children: [
      {
        title: 'Actions',
        children: [
          {
            title: 'SendEmail',
            path: 'bes/api-reference/actions/send-email',
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
