import { IBESEmailTemplate } from '@sharedtypes/bes';
import { api } from '@rootui/api';

const emailTemplatesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmailTemplates: builder.query({
      query: () => ({
        url: `/v1/d/bes/templates`,
        method: 'GET',
      }),
      providesTags: ['EmailTemplate'],
    }),
    getEmailTemplateById: builder.query({
      query: (templateId) => ({
        url: `/v1/d/bes/templates/${templateId}`,
        method: 'GET',
      }),
      providesTags: ['EmailTemplate'],
    }),
    createEmailTemplate: builder.mutation({
      query: (template) => ({
        url: `/v1/d/bes/templates`,
        method: 'POST',
        body: template,
      }),
      invalidatesTags: ['EmailTemplate'],
    }),
    updateEmailTemplate: builder.mutation({
      query: ({
        templateId,
        template,
      }: {
        templateId: string;
        template: Partial<IBESEmailTemplate>;
      }) => ({
        url: `/v1/d/bes/templates/${templateId}`,
        method: 'PUT',
        body: template,
      }),
      invalidatesTags: ['EmailTemplate'],
    }),
    deleteEmailTemplates: builder.mutation({
      query: (templateIds) => ({
        url: `/v1/d/bes/templates`,
        method: 'DELETE',
        body: { templateIds: templateIds },
      }),
      invalidatesTags: ['EmailTemplate'],
    }),
  }),
});

export const {
  useGetEmailTemplatesQuery,
  useGetEmailTemplateByIdQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplatesMutation,
} = emailTemplatesApi;
