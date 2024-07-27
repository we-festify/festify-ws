import api from '../../../api';

const docsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBESDocsNav: builder.query({
      query: () => `/d/bes/v1/docs/nav`,
    }),
  }),
});

export const { useGetBESDocsNavQuery } = docsApi;
