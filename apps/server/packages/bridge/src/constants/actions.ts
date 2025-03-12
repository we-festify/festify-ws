import { PermissionPolicyAction } from '@sharedtypes/aim/permission-policy';

export const bridgeActions: {
  description?: string;
  alias: PermissionPolicyAction;
}[] = [
  {
    alias: 'bridge:ListApis',
    description: 'Grants permission to list APIs',
  },
  {
    alias: 'bridge:CreateApi',
    description: 'Grants permission to create an API',
  },
  {
    alias: 'bridge:ReadApi',
    description: 'Grants permission to read an API',
  },
  {
    alias: 'bridge:UpdateApi',
    description: 'Grants permission to update an API',
  },
  {
    alias: 'bridge:DeleteApis',
    description: 'Grants permission to delete APIs with specified frn(s)',
  },
  {
    alias: 'bridge:ListApiEndpoints',
    description: 'Grants permission to list API endpoints',
  },
  {
    alias: 'bridge:CreateApiEndpoint',
    description: 'Grants permission to create an API endpoint',
  },
  {
    alias: 'bridge:ReadApiEndpoint',
    description: 'Grants permission to read an API endpoint',
  },
  {
    alias: 'bridge:UpdateApiEndpoint',
    description: 'Grants permission to update an API endpoint',
  },
  {
    alias: 'bridge:DeleteApiEndpoints',
    description:
      'Grants permission to delete API endpoints with specified frn(s)',
  },
];
