import api from "../api";

const instancesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInstances: builder.query({
      query: (type: string) => ({
        url: `/instances/${type}`,
        method: "GET",
      }),
      providesTags: ["Instance"],
    }),
    createInstance: builder.mutation({
      query: (data) => ({
        url: `/instances/${data.type}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Instance"],
    }),
  }),
});

export const { useGetInstancesQuery, useCreateInstanceMutation } = instancesApi;

export default instancesApi;
