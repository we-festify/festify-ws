import api from '.';

const instancesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInstances: builder.query({
      query: (type: string) => ({
        url: `/v1/instances/${type}`,
        method: 'GET',
      }),
      providesTags: ['Instance'],
    }),
    getInstance: builder.query({
      query: ({
        serviceType,
        instanceId,
      }: {
        serviceType: string;
        instanceId: string;
      }) => ({
        url: `/v1/instances/${serviceType}/${instanceId}`,
        method: 'GET',
      }),
      providesTags: ['Instance'],
    }),
    createInstance: builder.mutation({
      query: (data) => ({
        url: `/v1/instances/${data.type}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Instance'],
    }),
    updateInstance: builder.mutation({
      query: ({ serviceType, instanceId, data }) => ({
        url: `/v1/instances/${serviceType}/${instanceId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Instance'],
    }),
    updateCreds: builder.mutation({
      query: ({ serviceType, instanceId, creds }) => ({
        url: `/v1/instances/${serviceType}/${instanceId}/creds`,
        method: 'PUT',
        body: creds,
      }),
      invalidatesTags: ['Instance'],
    }),
  }),
});

export const {
  useGetInstancesQuery,
  useGetInstanceQuery,
  useCreateInstanceMutation,
  useUpdateInstanceMutation,
  useUpdateCredsMutation,
} = instancesApi;

export default instancesApi;
