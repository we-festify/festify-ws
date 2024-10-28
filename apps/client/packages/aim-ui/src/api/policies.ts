import {
  AttachUsersToPolicyRequest,
  CreatePolicyRequest,
  CreatePolicyResponse,
  GetPoliciesByAccountIdResponse,
  GetPolicyByIdResponse,
  UpdatePolicyRequest,
  UpdatePolicyResponse,
} from '@aim-ui/types/api/policies';
import { api } from '@rootui/api';

const policiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPolicies: builder.query<GetPoliciesByAccountIdResponse, void>({
      query: () => '/v1/d/aim/policies',
      providesTags: ['PermissionPolicy'],
    }),
    getPolicyById: builder.query<GetPolicyByIdResponse, string>({
      query: (policyId) => `/v1/d/aim/policies/${policyId}`,
      providesTags: ['PermissionPolicy'],
    }),
    createPolicy: builder.mutation<CreatePolicyResponse, CreatePolicyRequest>({
      query: (policy) => ({
        url: '/v1/d/aim/policies',
        method: 'POST',
        body: policy,
      }),
      invalidatesTags: ['PermissionPolicy'],
    }),
    updatePolicy: builder.mutation<UpdatePolicyResponse, UpdatePolicyRequest>({
      query: ({ policy, policyId }) => ({
        url: `/v1/d/aim/policies/${policyId}`,
        method: 'PUT',
        body: policy,
      }),
      invalidatesTags: ['PermissionPolicy'],
    }),
    deletePolicies: builder.mutation<void, string[]>({
      query: (policyIds) => ({
        url: '/v1/d/aim/policies',
        method: 'DELETE',
        body: { policyIds },
      }),
      invalidatesTags: ['PermissionPolicy'],
    }),
    attachUsersToPolicy: builder.mutation<void, AttachUsersToPolicyRequest>({
      query: ({ policyId, userIds }) => ({
        url: `/v1/d/aim/policies/${policyId}/users`,
        method: 'POST',
        body: { userIds },
      }),
      invalidatesTags: ['PermissionPolicy', 'ManagedUser'],
    }),
    detachUsersFromPolicy: builder.mutation<void, AttachUsersToPolicyRequest>({
      query: ({ policyId, userIds }) => ({
        url: `/v1/d/aim/policies/${policyId}/users`,
        method: 'DELETE',
        body: { userIds },
      }),
      invalidatesTags: ['PermissionPolicy', 'ManagedUser'],
    }),
  }),
});

export const {
  useGetPoliciesQuery,
  useGetPolicyByIdQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePoliciesMutation,
  useAttachUsersToPolicyMutation,
  useDetachUsersFromPolicyMutation,
} = policiesApi;
