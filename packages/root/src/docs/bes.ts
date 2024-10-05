export const besDocsNav = [
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
] as const;

export const besDocsAllowedPaths = [
  'userguide/welcome',
  'userguide/getting-started/index',

  'api-reference',

  'faqs',
];

export type BESPathType = (typeof besDocsAllowedPaths)[number];
