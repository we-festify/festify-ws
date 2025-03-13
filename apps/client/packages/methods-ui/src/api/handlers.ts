import { api } from '@rootui/api';
import { IMethodsHandler } from '@sharedtypes/methods';

interface IMethodsSummaryResponse {
  summary: {
    count: number;
    total: {
      codeSize: number;
      memory: number;
    };
    avg: {
      codeSize: number;
      memory: number;
      timeout: number;
    };
  };
  methodsByRuntime: {
    runtime: string;
    count: number;
  }[];
}

const handlersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listHandlers: builder.query<{ handlers: IMethodsHandler[] }, void>({
      query: () => ({
        url: `/v1/d/methods/execute/ListHandlers`,
        method: 'POST',
      }),
      providesTags: ['MethodsHandler'],
    }),
    createHandler: builder.mutation<undefined, Partial<IMethodsHandler>>({
      query: (handler) => ({
        url: `/v1/d/methods/execute/CreateHandler`,
        method: 'POST',
        body: { data: { handler } },
      }),
      invalidatesTags: ['MethodsHandler'],
    }),
    readHandler: builder.query<{ handler: IMethodsHandler }, string>({
      query: (frn) => ({
        url: `/v1/d/methods/execute/ReadHandler`,
        method: 'POST',
        body: { resource: frn },
      }),
      providesTags: ['MethodsHandler'],
    }),
    updateHandler: builder.mutation<
      undefined,
      { frn: string; handler: Partial<IMethodsHandler> }
    >({
      query: ({ frn, handler }) => ({
        url: `/v1/d/methods/execute/UpdateHandler`,
        method: 'POST',
        body: { resource: frn, data: { handler } },
      }),
      invalidatesTags: ['MethodsHandler'],
    }),
    deleteHandlers: builder.mutation<undefined, string[]>({
      query: (resource) => ({
        url: `/v1/d/methods/execute/DeleteHandlers`,
        method: 'POST',
        body: { resource },
      }),
      invalidatesTags: ['MethodsHandler'],
    }),

    readSummary: builder.query<IMethodsSummaryResponse, void>({
      query: () => ({
        url: `/v1/d/methods/execute/ReadSummary`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useListHandlersQuery,
  useCreateHandlerMutation,
  useReadHandlerQuery,
  useUpdateHandlerMutation,
  useDeleteHandlersMutation,

  useReadSummaryQuery,
} = handlersApi;
