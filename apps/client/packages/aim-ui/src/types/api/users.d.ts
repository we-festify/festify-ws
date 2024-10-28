import { IManagedUser } from '@sharedtypes/aim/managed-user';

export interface GetManagedUsersResponse {
  users: IManagedUser[];
}

export interface GetManagedUserByIdResponse {
  user: IManagedUser;
}

export interface CreateManagedUserRequest {
  alias: string;
  password: string;
}

export interface CreateManagedUserResponse {
  user: IManagedUser;
}

export interface UpdateManagedUserRequest {
  user: {
    alias: string;
    password: string;
  };
  userId: string;
}

export interface UpdateManagedUserResponse {
  user: IManagedUser;
}

export interface DeleteManagedUsersRequest {
  userIds: string[];
}

export interface AttachPoliciesToUserRequest {
  userId: string;
  policyIds: string[];
}

export interface DetachPoliciesFromUserRequest {
  userId: string;
  policyIds: string[];
}
