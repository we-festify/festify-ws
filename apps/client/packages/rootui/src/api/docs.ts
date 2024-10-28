import { api } from '.';

const docsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDocsNav: builder.query({
      query: (service?: string) => {
        if (service) return `/v1/docs/${service}`;
        return '/v1/docs/index';
      },
    }),
  }),
});

export const { useGetDocsNavQuery } = docsApi;
