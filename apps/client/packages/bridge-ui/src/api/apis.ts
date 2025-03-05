import { IBridgeApi } from '@sharedtypes/bridge';
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
    deleteApis: builder.mutation<void, string[]>({
      query: (frns) => ({
        url: `/v1/d/bridge/execute/DeleteApis`,
        method: 'POST',
        body: frns,
      }),
      invalidatesTags: ['BridgeApi'],
    }),
  }),
});

export const { useListApisQuery, useDeleteApisMutation } = bridgeApisApi;
