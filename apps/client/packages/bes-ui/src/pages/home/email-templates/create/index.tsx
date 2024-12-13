import EmailTemplateForm from '../../../../components/email-templates/email-template-form';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { useForm } from 'react-hook-form';
import { createEmailTemplateSchema, defaultValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@sharedui/primitives/form';
import { Button } from '@sharedui/primitives/button';
import { useCreateEmailTemplateMutation } from '../../../../api/email-templates';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { besPaths } from '@sharedui/constants/paths';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@sharedui/components/loading-button';

const CreateEmailTemplatePage = () => {
  const form = useForm<z.infer<typeof createEmailTemplateSchema>>({
    defaultValues,
    resolver: zodResolver(createEmailTemplateSchema),
  });
  const navigate = useNavigate();
  const [createEmailTemplate, { isLoading }] = useCreateEmailTemplateMutation();

  const handleCreateTemplate = async (
    values: z.infer<typeof createEmailTemplateSchema>,
  ) => {
    try {
      await createEmailTemplate(values).unwrap();
      toast.success('Email template created successfully');
      form.reset();
      navigate(besPaths.EMAIL_TEMPLATES, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8 m-auto max-w-[1024px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateTemplate)}>
          <PageSection
            title="Create email template"
            description="Email templates enable you to send personalized email to one or more destinations."
          >
            <Card>
              <CardContent>
                <EmailTemplateForm form={form} />
              </CardContent>
            </Card>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(besPaths.EMAIL_TEMPLATES, { replace: true });
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="secondary"
                size="sm"
                type="submit"
                loading={isLoading}
              >
                Create email template
              </LoadingButton>
            </div>
          </PageSection>
        </form>
      </Form>
    </div>
  );
};

export default CreateEmailTemplatePage;
