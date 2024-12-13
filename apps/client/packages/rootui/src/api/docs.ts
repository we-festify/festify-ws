import { IDocsNav } from '@sharedtypes/docs';
import { api } from '.';

const docsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDocsNav: builder.query<
      {
        base_uri: string;
        nav: IDocsNav;
        meta: { title: string };
      },
      string
    >({
      query: (service?: string) => {
        if (service) return `/v1/docs/${service}`;
        return '/v1/docs/index';
      },
    }),
  }),
});

export const { useGetDocsNavQuery } = docsApi;
