import { api } from '@rootui/api';
import { IAccountSummary } from '@sharedtypes/aim/general';

const generalApi = api.injectEndpoints({
  endpoints: (builder) => ({
    readAccountSummary: builder.query<IAccountSummary, undefined>({
      query: () => ({
        url: `/v1/d/aim/execute/ReadAccountSummary`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useReadAccountSummaryQuery } = generalApi;
