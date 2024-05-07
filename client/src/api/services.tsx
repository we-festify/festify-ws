import api from "../api";

const servicesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyServices: builder.query({
      query: () => ({
        url: "/services/mine",
        method: "GET",
      }),
      providesTags: ["Service"],
    }),
    getAllServicesMeta: builder.query({
      query: () => ({
        url: "/services/all",
        method: "GET",
      }),
      providesTags: ["Service"],
    }),
    getServiceMetaByType: builder.query({
      query: (type: string) => ({
        url: `/services/${type}`,
        method: "GET",
      }),
      providesTags: ["Service"],
    }),
    enableService: builder.mutation({
      query: (type: string) => ({
        url: `/services/${type}/enable`,
        method: "POST",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
});

export const {
  useGetMyServicesQuery,
  useGetAllServicesMetaQuery,
  useGetServiceMetaByTypeQuery,
  useEnableServiceMutation,
} = servicesApi;

export default servicesApi;
