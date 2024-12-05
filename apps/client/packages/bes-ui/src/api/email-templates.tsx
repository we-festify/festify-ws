import { IBESEmailTemplate } from '@sharedtypes/bes';
import { api } from '@rootui/api';

const emailTemplatesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listEmailTemplates: builder.query<
      { templates: IBESEmailTemplate[] },
      undefined
    >({
      query: () => ({
        url: `/v1/d/bes/execute/ListEmailTemplates`,
        method: 'POST',
      }),
      providesTags: ['EmailTemplate'],
    }),
    readEmailTemplate: builder.query<{ template: IBESEmailTemplate }, string>({
      query: (frn: string) => ({
        url: `/v1/d/bes/execute/ReadEmailTemplate`,
        method: 'POST',
        body: { resource: frn },
      }),
      providesTags: ['EmailTemplate'],
    }),
    createEmailTemplate: builder.mutation<
      undefined,
      Partial<IBESEmailTemplate>
    >({
      query: (template) => ({
        url: `/v1/d/bes/execute/CreateEmailTemplate`,
        method: 'POST',
        body: { data: { template } },
      }),
      invalidatesTags: ['EmailTemplate'],
    }),
    updateEmailTemplate: builder.mutation<
      undefined,
      { frn: string; template: Partial<IBESEmailTemplate> }
    >({
      query: ({ frn, template }) => ({
        url: `/v1/d/bes/execute/UpdateEmailTemplate`,
        method: 'POST',
        body: { resource: frn, data: { template } },
      }),
      invalidatesTags: ['EmailTemplate'],
    }),
    deleteEmailTemplates: builder.mutation<undefined, string[]>({
      query: (frns: string[]) => ({
        url: `/v1/d/bes/execute/DeleteEmailTemplates`,
        method: 'POST',
        body: { resource: frns },
      }),
      invalidatesTags: ['EmailTemplate'],
    }),
  }),
});

export const {
  useListEmailTemplatesQuery,
  useReadEmailTemplateQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplatesMutation,
} = emailTemplatesApi;
