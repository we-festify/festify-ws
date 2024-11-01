import {
  CreateManagedUserRequest,
  CreateManagedUserResponse,
  GetManagedUserByIdResponse,
  GetManagedUsersResponse,
  UpdateManagedUserRequest,
  UpdateManagedUserResponse,
  AttachPoliciesToUserRequest,
  DetachPoliciesFromUserRequest,
} from '@aim-ui/types/api/users';
import { api } from '@rootui/api';

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getManagedUsers: builder.query<
      GetManagedUsersResponse,
      { policy?: string } | void
    >({
      query: ({ policy } = {}) =>
        '/v1/d/aim/users' + (policy ? `?policy=${policy}` : ''),
      providesTags: ['ManagedUser'],
    }),
    getManagedUserById: builder.query<GetManagedUserByIdResponse, string>({
      query: (userId) => `/v1/d/aim/users/${userId}`,
      providesTags: ['ManagedUser'],
    }),
    createManagedUser: builder.mutation<
      CreateManagedUserResponse,
      CreateManagedUserRequest
    >({
      query: (body) => ({
        url: '/v1/d/aim/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ManagedUser'],
    }),
    updateManagedUser: builder.mutation<
      UpdateManagedUserResponse,
      UpdateManagedUserRequest
    >({
      query: ({ user, userId }) => ({
        url: `/v1/d/aim/users/${userId}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: ['ManagedUser'],
    }),
    deleteManagedUsers: builder.mutation<void, string[]>({
      query: (userIds) => ({
        url: '/v1/d/aim/users',
        method: 'DELETE',
        body: { userIds },
      }),
      invalidatesTags: ['ManagedUser'],
    }),
    attachPoliciesToUser: builder.mutation<void, AttachPoliciesToUserRequest>({
      query: ({ userId, policyIds }) => ({
        url: `/v1/d/aim/users/${userId}/policies`,
        method: 'POST',
        body: { policyIds },
      }),
      invalidatesTags: ['ManagedUser', 'PermissionPolicy'],
    }),
    detachPoliciesFromUser: builder.mutation<
      void,
      DetachPoliciesFromUserRequest
    >({
      query: ({ userId, policyIds }) => ({
        url: `/v1/d/aim/users/${userId}/policies`,
        method: 'DELETE',
        body: { policyIds },
      }),
      invalidatesTags: ['ManagedUser', 'PermissionPolicy'],
    }),
  }),
});

export const {
  useGetManagedUsersQuery,
  useGetManagedUserByIdQuery,
  useCreateManagedUserMutation,
  useUpdateManagedUserMutation,
  useDeleteManagedUsersMutation,
  useAttachPoliciesToUserMutation,
  useDetachPoliciesFromUserMutation,
} = usersApi;
