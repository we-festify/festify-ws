import { IBESInstance } from '@sharedtypes/bes';
import { api } from '@rootui/api';

const besInstancesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listInstances: builder.query<{ instances: IBESInstance[] }, undefined>({
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
    createInstance: builder.mutation<undefined, Partial<IBESInstance>>({
      query: (instance: Partial<IBESInstance>) => ({
        url: `/v1/d/bes/execute/CreateInstance`,
        method: 'POST',
        body: { data: { instance } },
      }),
      invalidatesTags: ['BESInstance'],
    }),
    updateInstance: builder.mutation<
      undefined,
      { frn: string; instance: Partial<IBESInstance> }
    >({
      query: ({ frn, instance }) => ({
        url: `/v1/d/bes/execute/UpdateInstance`,
        method: 'POST',
        body: { resource: frn, data: { instance } },
      }),
      invalidatesTags: ['BESInstance'],
    }),
    deleteInstances: builder.mutation<undefined, string[]>({
      query: (frns: string[]) => ({
        url: `/v1/d/bes/execute/DeleteInstances`,
        method: 'POST',
        body: { resource: frns },
      }),
      invalidatesTags: ['BESInstance'],
    }),
  }),
});

export const {
  useListInstancesQuery,
  useReadInstanceQuery,
  useCreateInstanceMutation,
  useUpdateInstanceMutation,
  useDeleteInstancesMutation,
} = besInstancesApi;
