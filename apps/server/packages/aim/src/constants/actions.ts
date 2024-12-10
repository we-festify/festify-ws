import { PermissionPolicyAction } from '@sharedtypes/aim/permission-policy';
import { besActions } from '@bes/constants/actions';

type Action = {
  alias: PermissionPolicyAction;
  description: string;
};

const createAction = (
  alias: PermissionPolicyAction,
  description: string,
): Action => ({
  alias,
  description,
});

const aimActions: Action[] = [
  createAction('aim:ListManagedUsers', 'Grants permission to list AIM users'),
  createAction(
    'aim:CreateManagedUser',
    'Grants permission to create an AIM user',
  ),
  createAction('aim:ReadManagedUser', 'Grants permission to read an AIM user'),
  createAction(
    'aim:UpdateManagedUser',
    'Grants permission to update an AIM user',
  ),
  createAction(
    'aim:DeleteManagedUser',
    'Grants permission to delete an AIM user',
  ),
  createAction(
    'aim:ListPolicies',
    'Grants permission to list permission policies',
  ),
  createAction(
    'aim:CreatePolicy',
    'Grants permission to create a permission policy',
  ),
  createAction(
    'aim:ReadPolicy',
    'Grants permission to read a permission policy',
  ),
  createAction(
    'aim:UpdatePolicy',
    'Grants permission to update a permission policy',
  ),
  createAction(
    'aim:DeletePolicy',
    'Grants permission to delete a permission policy',
  ),
  createAction(
    'aim:AttachUserPolicies',
    'Grants permission to attach policies to a user',
  ),
  createAction(
    'aim:DetachUserPolicies',
    'Grants permission to detach policies from a user',
  ),
  createAction(
    'aim:AttachUsersPolicy',
    'Grants permission to attach users to a policy',
  ),
  createAction(
    'aim:DetachUsersPolicy',
    'Grants permission to detach users from a policy',
  ),
  createAction(
    'aim:ListPolicyAttachedUsers',
    'Grants permission to list users attached to a policy',
  ),
  createAction(
    'aim:CreateAccessKey',
    'Grants permission to create an access key for a user',
  ),
  createAction(
    'aim:ReadAccessKey',
    'Grants permission to read an access key details for a user',
  ),
  createAction(
    'aim:RotateAccessKey',
    'Grants permission to rotate an access key for a user',
  ),
  createAction(
    'aim:DeleteAccessKey',
    'Grants permission to delete an access key for a user',
  ),
];

export const ACTIONS: {
  description?: string;
  alias: PermissionPolicyAction;
}[] = [...besActions, ...aimActions];
