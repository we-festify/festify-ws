import { BESEmailTemplateType } from '@shared/types/bes';
import api from '../../../api';

const emailTemplatesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmailTemplates: builder.query({
      query: () => ({
        url: `/d/bes/v1/templates`,
        method: 'GET',
      }),
      providesTags: ['EmailTemplate'],
    }),
    getEmailTemplateById: builder.query({
      query: (templateId) => ({
        url: `/d/bes/v1/templates/${templateId}`,
        method: 'GET',
      }),
      providesTags: ['EmailTemplate'],
    }),
    createEmailTemplate: builder.mutation({
      query: (template) => ({
        url: `/d/bes/v1/templates`,
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
        template: Partial<BESEmailTemplateType>;
      }) => ({
        url: `/d/bes/v1/templates/${templateId}`,
        method: 'PUT',
        body: template,
      }),
      invalidatesTags: ['EmailTemplate'],
    }),
    deleteEmailTemplates: builder.mutation({
      query: (templateIds) => ({
        url: `/d/bes/v1/templates`,
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
