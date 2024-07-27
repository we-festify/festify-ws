import { BESInstanceType } from '@shared/types/bes';
import api from '../../../api';

const besInstancesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBESInstances: builder.query({
      query: () => ({
        url: `/d/bes/v1/instances`,
        method: 'GET',
      }),
      providesTags: ['BESInstance'],
    }),
    getInstanceById: builder.query({
      query: (instanceId: string) => ({
        url: `/d/bes/v1/instances/${instanceId}`,
        method: 'GET',
      }),
      providesTags: ['BESInstance'],
    }),
    getBESInstanceByAlias: builder.query({
      query: (alias: string) => ({
        url: `/d/bes/v1/instances/alias/${alias}`,
        method: 'GET',
      }),
      providesTags: ['BESInstance'],
    }),
    createBESInstance: builder.mutation({
      query: (data: Partial<BESInstanceType>) => ({
        url: `/d/bes/v1/instances`,
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
        instance: Partial<BESInstanceType>;
      }) => ({
        url: `/d/bes/v1/instances/${instanceId}`,
        method: 'PATCH',
        body: instance,
      }),
      invalidatesTags: ['BESInstance'],
    }),
    deleteBESInstances: builder.mutation({
      query: (instanceIds: string[]) => ({
        url: `/d/bes/v1/instances`,
        method: 'DELETE',
        body: { instanceIds },
      }),
      invalidatesTags: ['BESInstance'],
    }),
  }),
});

export const {
  useGetBESInstancesQuery,
  useGetBESInstanceByAliasQuery,
  useCreateBESInstanceMutation,
  useUpdateBESInstanceMutation,
  useDeleteBESInstancesMutation,
} = besInstancesApi;
