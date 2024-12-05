import { api } from '@rootui/api';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';

const policiesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listPolicies: builder.query<{ policies: IPermissionPolicy[] }, undefined>({
      query: () => ({
        url: `/v1/d/aim/execute/ListPolicies`,
        method: 'POST',
      }),
      providesTags: ['PermissionPolicy'],
    }),
    readPolicy: builder.query<{ policy: IPermissionPolicy }, string>({
      query: (frn: string) => ({
        url: `/v1/d/aim/execute/ReadPolicy`,
        method: 'POST',
        body: {
          resource: frn,
        },
      }),
      providesTags: ['PermissionPolicy'],
    }),
    createPolicy: builder.mutation<undefined, Partial<IPermissionPolicy>>({
      query: (policy: Partial<IPermissionPolicy>) => ({
        url: `/v1/d/aim/execute/CreatePolicy`,
        method: 'POST',
        body: { data: { policy } },
      }),
      invalidatesTags: ['PermissionPolicy'],
    }),
    updatePolicy: builder.mutation<
      undefined,
      { frn: string; policy: Partial<IPermissionPolicy> }
    >({
      query: ({ frn, policy }) => ({
        url: `/v1/d/aim/execute/UpdatePolicy`,
        method: 'POST',
        body: { resource: frn, data: { policy } },
      }),
      invalidatesTags: ['PermissionPolicy'],
    }),
    deletePolicies: builder.mutation<undefined, string[]>({
      query: (frns: string[]) => ({
        url: `/v1/d/aim/execute/DeletePolicies`,
        method: 'POST',
        body: { resource: frns },
      }),
      invalidatesTags: ['PermissionPolicy'],
    }),
    attachUserPolicies: builder.mutation<
      undefined,
      { userFrn: string; policyFrns: string[] }
    >({
      query: ({ userFrn, policyFrns }) => ({
        url: `/v1/d/aim/execute/AttachUserPolicies`,
        method: 'POST',
        body: { resource: [userFrn, ...policyFrns] },
      }),
      invalidatesTags: ['PermissionPolicy'],
    }),
    attachUsersPolicy: builder.mutation<
      undefined,
      { userFrns: string[]; policyFrn: string }
    >({
      query: ({ userFrns, policyFrn }) => ({
        url: `/v1/d/aim/execute/AttachUsersPolicy`,
        method: 'POST',
        body: { resource: [...userFrns, policyFrn] },
      }),
      invalidatesTags: ['PermissionPolicy'],
    }),
  }),
});

export const {
  useListPoliciesQuery,
  useReadPolicyQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePoliciesMutation,
  useAttachUserPoliciesMutation,
  useAttachUsersPolicyMutation,
} = policiesApi;
