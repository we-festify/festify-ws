import api from '../..';

const emailTemplatesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmailTemplates: builder.query({
      query: ({ instanceId }) => ({
        url: `/d/in/bes/${instanceId}/templates`,
        method: 'GET',
      }),
      providesTags: ['EmailTemplate'],
    }),
    createEmailTemplate: builder.mutation({
      query: ({ instanceId, template }) => ({
        url: `/d/in/bes/${instanceId}/templates`,
        method: 'POST',
        body: template,
      }),
      invalidatesTags: ['EmailTemplate'],
    }),
    updateEmailTemplate: builder.mutation({
      query: ({ instanceId, templateId, template }) => ({
        url: `/d/in/bes/${instanceId}/templates/${templateId}`,
        method: 'PUT',
        body: template,
      }),
      invalidatesTags: ['EmailTemplate'],
    }),
    deleteEmailTemplate: builder.mutation({
      query: ({ instanceId, templateId }) => ({
        url: `/d/in/bes/${instanceId}/templates/${templateId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EmailTemplate'],
    }),
  }),
});

export const {
  useGetEmailTemplatesQuery,
  useCreateEmailTemplateMutation,
  useUpdateEmailTemplateMutation,
  useDeleteEmailTemplateMutation,
} = emailTemplatesApi;
