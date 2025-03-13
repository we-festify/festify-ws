import { PermissionPolicyAction } from '@sharedtypes/aim/permission-policy';

export const methodsActions: {
  description?: string;
  alias: PermissionPolicyAction;
}[] = [
  {
    alias: 'methods:ListHandlers',
    description: 'Grants permission to list handlers',
  },
  {
    alias: 'methods:CreateHandler',
    description: 'Grants permission to create a handler',
  },
  {
    alias: 'methods:ReadHandler',
    description: 'Grants permission to read a handler',
  },
  {
    alias: 'methods:UpdateHandler',
    description: 'Grants permission to update a handler',
  },
  {
    alias: 'methods:DeleteHandlers',
    description: 'Grants permission to delete handlers with specified frn(s)',
  },
  {
    alias: 'methods:ReadSummary',
    description: 'Grants permission to read summary of handlers',
  },
  {
    alias: 'methods:InvokeHandler',
    description: 'Grants permission to invoke a handler',
  },
];
