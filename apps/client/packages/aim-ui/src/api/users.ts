import { api } from '@rootui/api';
import { IManagedUser } from '@sharedtypes/aim/managed-user';

const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listManagedUsers: builder.query<{ users: IManagedUser[] }, undefined>({
      query: () => ({
        url: `/v1/d/aim/execute/ListManagedUsers`,
        method: 'POST',
      }),
      providesTags: ['ManagedUser'],
    }),
    readManagedUser: builder.query<{ user: IManagedUser }, string>({
      query: (frn: string) => ({
        url: `/v1/d/aim/execute/ReadManagedUser`,
        method: 'POST',
        body: {
          resource: frn,
        },
      }),
      providesTags: ['ManagedUser'],
    }),
    createManagedUser: builder.mutation<undefined, Partial<IManagedUser>>({
      query: (user: Partial<IManagedUser>) => ({
        url: `/v1/d/aim/execute/CreateManagedUser`,
        method: 'POST',
        body: { data: { user } },
      }),
      invalidatesTags: ['ManagedUser'],
    }),
    updateManagedUser: builder.mutation<
      undefined,
      { frn: string; user: Partial<IManagedUser> }
    >({
      query: ({ frn, user }) => ({
        url: `/v1/d/aim/execute/UpdateManagedUser`,
        method: 'POST',
        body: { resource: frn, data: { user } },
      }),
      invalidatesTags: ['ManagedUser'],
    }),
    deleteManagedUsers: builder.mutation<undefined, string[]>({
      query: (frns: string[]) => ({
        url: `/v1/d/aim/execute/DeleteManagedUsers`,
        method: 'POST',
        body: { resource: frns },
      }),
      invalidatesTags: ['ManagedUser'],
    }),
  }),
});

export const {
  useListManagedUsersQuery,
  useReadManagedUserQuery,
  useCreateManagedUserMutation,
  useUpdateManagedUserMutation,
  useDeleteManagedUsersMutation,
} = usersApi;
