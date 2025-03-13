export const rootPaths = {
  DOCS: '/docs',

  HOME: '/',

  AUTH: '/a',
} as const;

export const besPaths = {
  SERVICE: '/bes',

  HOME: '/bes/home',

  DOCS: '/docs/bes',

  INSTANCES: '/bes/home/instances',
  CREATE_NEW_INSTANCE: '/bes/home/instances/create',
  UPDATE_INSTANCE: '/bes/home/instances/update',
  INSTANCE_DETAILS: '/bes/home/instances/details',

  EMAIL_TEMPLATES: '/bes/home/templates',
  CREATE_NEW_EMAIL_TEMPLATE: '/bes/home/templates/create',
  UPDATE_EMAIL_TEMPLATE: '/bes/home/templates/update',
  EMAIL_TEMPLATE_DETAILS: '/bes/home/templates/details',
} as const;

export const aimPaths = {
  SERVICE: '/aim',

  HOME: '/aim/home',

  DOCS: '/docs/aim',

  USERS: '/aim/home/users',
  CREATE_NEW_USER: '/aim/home/users/create',
  USER_DETAILS: '/aim/home/users/details',
  UPDATE_USER: '/aim/home/users/update',

  POLICIES: '/aim/home/policies',
  CREATE_NEW_POLICY: '/aim/home/policies/create',
  UPDATE_POLICY: '/aim/home/policies/update',
  POLICY_DETAILS: '/aim/home/policies/details',
} as const;

export const analogPaths = {
  SERVICE: '/analog',

  HOME: '/analog/home',

  DOCS: '/docs/analog',

  INSIGHTS: '/analog/home/insights',
} as const;

export const bridgePaths = {
  SERVICE: '/bridge',

  HOME: '/bridge/home',

  DOCS: '/docs/bridge',

  APIS: '/bridge/home/apis',
  CREATE_NEW_API: '/bridge/home/apis/create',
  UPDATE_API: '/bridge/home/apis/update',
  API_DETAILS: (alias: string) => `/bridge/home/apis/details/${alias}` as const,

  CREATE_NEW_API_ENDPOINT: (apiId: string) =>
    `/bridge/home/apis/details/${apiId}/endpoints/create` as const,
  UPDATE_API_ENDPOINT: (apiId: string, endpoint: string) =>
    `/bridge/home/apis/details/${apiId}/endpoints/update?endpoint=${endpoint}` as const,
  API_ENDPOINT_DETAILS: (apiId: string, endpoint: string) =>
    `/bridge/home/apis/details/${apiId}?endpoint=${endpoint}` as const,
} as const;

export const methodsPaths = {
  SERVICE: '/methods',

  HOME: '/methods/home',

  DOCS: '/docs/methods',

  HANDLERS: '/methods/home/handlers',
  CREATE_NEW_HANDLER: '/methods/home/handlers/create',
  UPDATE_HANDLER: (alias: string) =>
    `/methods/home/handlers/update/${alias}` as const,
  HANDLER_DETAILS: (alias: string) =>
    `/methods/home/handlers/details/${alias}` as const,
} as const;

const paths = {
  root: rootPaths,
  bes: besPaths,
  aim: aimPaths,
  analog: analogPaths,
  bridge: bridgePaths,
  methods: methodsPaths,
} as const;

export default paths;
