import { PermissionPolicyAction } from '@sharedtypes/aim/permission-policy';

export const besActions: {
  description?: string;
  alias: PermissionPolicyAction;
}[] = [
  {
    alias: 'bes:ListInstances',
    description: 'List all the instances in the root account',
  },
  {
    alias: 'bes:CreateInstance',
    description: 'Create a new instance in the root account',
  },
  {
    alias: 'bes:DeleteInstance',
    description: 'Delete an instance in the root account',
  },
  {
    alias: 'bes:UpdateInstance',
    description: 'Update an instance in the root account',
  },
];
