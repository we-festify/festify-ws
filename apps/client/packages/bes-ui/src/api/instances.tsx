import { IBESInstance } from '@sharedtypes/bes';
import { api } from '@rootui/api';

const besInstancesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBESInstances: builder.query({
      query: () => ({
        url: `/v1/d/bes/execute/ListInstances`,
        method: 'POST',
      }),
      providesTags: ['BESInstance'],
    }),
    getInstanceById: builder.query({
      query: (instanceId: string) => ({
        url: `/v1/d/bes/execute/ReadInstance`,
        method: 'POST',
        body: {
          resource: instanceId,
        },
      }),
      providesTags: ['BESInstance'],
    }),
    getBESInstanceByAlias: builder.query({
      query: (alias: string) => ({
        url: `/v1/d/bes/execute/ReadInstance`,
        method: 'POST',
        body: {
          resource: alias,
        },
      }),
      providesTags: ['BESInstance'],
    }),
    createBESInstance: builder.mutation({
      query: (data: Partial<IBESInstance>) => ({
        url: `/v1/d/bes/instances`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BESInstance'],
    }),
    updateBESInstance: builder.mutation({
      query: ({
        instanceId,
        instance,
      }: {
        instanceId: string;
        instance: Partial<IBESInstance>;
      }) => ({
        url: `/v1/d/bes/instances/${instanceId}`,
        method: 'PATCH',
        body: instance,
      }),
      invalidatesTags: ['BESInstance'],
    }),
    deleteBESInstances: builder.mutation({
      query: (instanceIds: string[]) => ({
        url: `/v1/d/bes/instances`,
        method: 'DELETE',
        body: { instanceIds },
      }),
      invalidatesTags: ['BESInstance'],
    }),

    listInstances: builder.query<unknown, string>({
      query: () => ({
        url: `/v1/d/bes/execute/ListInstances`,
        method: 'POST',
      }),
      providesTags: ['BESInstance'],
    }),
    readInstance: builder.query<{ instance: IBESInstance }, string>({
      query: (frn: string) => ({
        url: `/v1/d/bes/execute/ReadInstance`,
        method: 'POST',
        body: {
          resource: frn,
        },
      }),
      providesTags: ['BESInstance'],
    }),
  }),
});

export const {
  useGetBESInstancesQuery,
  useGetBESInstanceByAliasQuery,
  useCreateBESInstanceMutation,
  useUpdateBESInstanceMutation,
  useDeleteBESInstancesMutation,

  useListInstancesQuery,
  useReadInstanceQuery,
} = besInstancesApi;
