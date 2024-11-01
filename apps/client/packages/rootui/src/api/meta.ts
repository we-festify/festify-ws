import {
  GetActionsByServiceResponse,
  GetServicesMetaResponse,
} from '@rootui/types/api/meta';
import { api } from '.';

const metaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getServicesMetadata: builder.query<GetServicesMetaResponse, void>({
      query: () => '/v1/meta/services',
      providesTags: ['Meta'],
    }),
    getActionsByService: builder.query<GetActionsByServiceResponse, string>({
      query: (serviceName) => `/v1/meta/services/${serviceName}/actions`,
      providesTags: ['Meta'],
    }),
  }),
});

export const { useGetServicesMetadataQuery, useGetActionsByServiceQuery } =
  metaApi;
