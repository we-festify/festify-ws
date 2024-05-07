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
  }),
});

export const { useGetInstancesQuery } = instancesApi;

export default instancesApi;
