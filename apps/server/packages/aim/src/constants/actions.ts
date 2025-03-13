import { PermissionPolicyAction } from '@sharedtypes/aim/permission-policy';
import { besActions } from '@bes/constants/actions';
import { bridgeActions } from '@bridge/constants/actions';
import { methodsActions } from '@methods/constants/actions';

export const aimActions: {
  description?: string;
  alias: PermissionPolicyAction;
}[] = [
  {
    alias: 'aim:ListManagedUsers',
    description: 'Grants permission to list AIM users',
  },
  {
    alias: 'aim:CreateManagedUser',
    description: 'Grants permission to create an AIM user',
  },
  {
    alias: 'aim:ReadManagedUser',
    description: 'Grants permission to read an AIM user',
  },
  {
    alias: 'aim:UpdateManagedUser',
    description: 'Grants permission to update an AIM user',
  },
  {
    alias: 'aim:DeleteManagedUser',
    description: 'Grants permission to delete an AIM user',
  },
  {
    alias: 'aim:ListPolicies',
    description: 'Grants permission to list permission policies',
  },
  {
    alias: 'aim:CreatePolicy',
    description: 'Grants permission to create a permission policy',
  },
  {
    alias: 'aim:ReadPolicy',
    description: 'Grants permission to read a permission policy',
  },
  {
    alias: 'aim:UpdatePolicy',
    description: 'Grants permission to update a permission policy',
  },
  {
    alias: 'aim:DeletePolicy',
    description: 'Grants permission to delete a permission policy',
  },
  {
    alias: 'aim:AttachUserPolicies',
    description: 'Grants permission to attach policies to a user',
  },
  {
    alias: 'aim:DetachUserPolicies',
    description: 'Grants permission to detach policies from a user',
  },
  {
    alias: 'aim:AttachUsersPolicy',
    description: 'Grants permission to attach users to a policy',
  },
  {
    alias: 'aim:DetachUsersPolicy',
    description: 'Grants permission to detach users from a policy',
  },
  {
    alias: 'aim:ListPolicyAttachedUsers',
    description: 'Grants permission to list users attached to a policy',
  },
  {
    alias: 'aim:CreateAccessKey',
    description: 'Grants permission to create an access key for a user',
  },
  {
    alias: 'aim:ReadAccessKey',
    description: 'Grants permission to read an access key details for a user',
  },
  {
    alias: 'aim:RotateAccessKey',
    description: 'Grants permission to rotate an access key for a user',
  },
  {
    alias: 'aim:DeleteAccessKey',
    description: 'Grants permission to delete an access key for a user',
  },
  {
    alias: 'aim:ReadAccountSummary',
    description: 'Grants permission to read account summary',
  },
];

export const ACTIONS: {
  description?: string;
  alias: PermissionPolicyAction;
}[] = [...besActions, ...aimActions, ...bridgeActions, ...methodsActions];
