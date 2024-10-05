import api from '.';

const docsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDocsNav: builder.query({
      query: (service?: string) => {
        if (service) return `/v1/docs/nav/${service}`;
        return '/v1/docs/nav';
      },
    }),
  }),
});

export const { useGetDocsNavQuery } = docsApi;
