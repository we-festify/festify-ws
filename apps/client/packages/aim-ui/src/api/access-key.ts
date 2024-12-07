import { api } from '@rootui/api';
import { IAccessKey } from '@sharedtypes/aim/access-key';

const accessKeyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createAccessKey: builder.mutation<{ secret: string }, string>({
      query: (frn: string) => ({
        url: `/v1/d/aim/execute/CreateAccessKey`,
        method: 'POST',
        body: { resource: frn },
      }),
      invalidatesTags: ['AimAccessKey'],
    }),
    readAccessKey: builder.query<
      { accessKey: Omit<IAccessKey, 'token'> },
      string
    >({
      query: (frn: string) => ({
        url: `/v1/d/aim/execute/ReadAccessKey`,
        method: 'POST',
        body: {
          resource: frn,
        },
      }),
      providesTags: ['AimAccessKey'],
    }),
    rotateAccessKey: builder.mutation<{ secret: string }, string>({
      query: (frn: string) => ({
        url: `/v1/d/aim/execute/RotateAccessKey`,
        method: 'POST',
        body: { resource: frn },
      }),
      invalidatesTags: ['AimAccessKey'],
    }),
    deleteAccessKey: builder.mutation<undefined, string>({
      query: (frn: string) => ({
        url: `/v1/d/aim/execute/DeleteAccessKey`,
        method: 'POST',
        body: { resource: frn },
      }),
      invalidatesTags: ['AimAccessKey'],
    }),
  }),
});

export const {
  useCreateAccessKeyMutation,
  useReadAccessKeyQuery,
  useRotateAccessKeyMutation,
  useDeleteAccessKeyMutation,
} = accessKeyApi;
