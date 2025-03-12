import { IBridgeApi, IBridgeApiEndpoint } from '@sharedtypes/bridge';
import { api } from '@rootui/api';

const bridgeApisApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listApis: builder.query<{ apis: IBridgeApi[] }, undefined>({
      query: () => ({
        url: `/v1/d/bridge/execute/ListApis`,
        method: 'POST',
      }),
      providesTags: ['BridgeApi'],
    }),
    createApi: builder.mutation<undefined, Partial<IBridgeApi>>({
      query: (api) => ({
        url: `/v1/d/bridge/execute/CreateApi`,
        method: 'POST',
        body: { data: { api } },
      }),
      invalidatesTags: ['BridgeApi'],
    }),
    updateApi: builder.mutation<
      undefined,
      { frn: string; api: Partial<IBridgeApi> }
    >({
      query: ({ frn, api }) => ({
        url: `/v1/d/bridge/execute/UpdateApi`,
        method: 'POST',
        body: { data: { api }, resource: frn },
      }),
      invalidatesTags: ['BridgeApi'],
    }),
    readApi: builder.query<{ api: IBridgeApi }, string>({
      query: (frn) => ({
        url: `/v1/d/bridge/execute/ReadApi`,
        method: 'POST',
        body: { resource: frn },
      }),
      providesTags: ['BridgeApi'],
    }),
    deleteApis: builder.mutation<void, string[]>({
      query: (frns) => ({
        url: `/v1/d/bridge/execute/DeleteApis`,
        method: 'POST',
        body: { resource: frns },
      }),
      invalidatesTags: ['BridgeApi'],
    }),

    listApiEndpoints: builder.query<
      { endpoints: IBridgeApiEndpoint[] },
      string
    >({
      query: (frn) => ({
        url: `/v1/d/bridge/execute/ListApiEndpoints`,
        method: 'POST',
        body: { resource: frn },
      }),
      providesTags: ['BridgeApi'],
    }),
    readApiEndpoint: builder.query<
      { endpoint: IBridgeApiEndpoint },
      { apiFrn: string; endpointFrn: string }
    >({
      query: ({ apiFrn, endpointFrn }) => ({
        url: `/v1/d/bridge/execute/ReadApiEndpoint`,
        method: 'POST',
        body: { resource: [apiFrn, endpointFrn] },
      }),
      providesTags: ['BridgeApi'],
    }),
    createApiEndpoint: builder.mutation<
      undefined,
      { frn: string; endpoint: Partial<IBridgeApiEndpoint> }
    >({
      query: ({ frn, endpoint }) => ({
        url: `/v1/d/bridge/execute/CreateApiEndpoint`,
        method: 'POST',
        body: { data: { endpoint }, resource: frn },
      }),
      invalidatesTags: ['BridgeApi'],
    }),
    updateApiEndpoint: builder.mutation<
      undefined,
      {
        apiFrn: string;
        endpointFrn: string;
        endpoint: Partial<IBridgeApiEndpoint>;
      }
    >({
      query: ({ apiFrn, endpointFrn, endpoint }) => ({
        url: `/v1/d/bridge/execute/UpdateApiEndpoint`,
        method: 'POST',
        body: { data: { endpoint }, resource: [apiFrn, endpointFrn] },
      }),
      invalidatesTags: ['BridgeApi'],
    }),
    deleteApiEndpoints: builder.mutation<
      void,
      { apiFrn: string; endpointFrns: string[] }
    >({
      query: ({ apiFrn, endpointFrns }) => ({
        url: `/v1/d/bridge/execute/DeleteApiEndpoints`,
        method: 'POST',
        body: { resource: [apiFrn, ...endpointFrns] },
      }),
      invalidatesTags: ['BridgeApi'],
    }),
  }),
});

export const {
  useListApisQuery,
  useDeleteApisMutation,
  useCreateApiMutation,
  useUpdateApiMutation,
  useReadApiQuery,

  useListApiEndpointsQuery,
  useReadApiEndpointQuery,
  useCreateApiEndpointMutation,
  useUpdateApiEndpointMutation,
  useDeleteApiEndpointsMutation,
} = bridgeApisApi;
