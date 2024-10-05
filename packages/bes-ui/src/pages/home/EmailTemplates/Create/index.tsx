import EmailTemplateForm from '../../../../components/EmailTemplates/EmailTemplateForm';
import PageSection from '@sharedui/components/PageSection';
import { Card, CardContent } from '@sharedui/primitives/card';
import { useForm } from 'react-hook-form';
import { createEmailTemplateSchema, defaultValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@sharedui/primitives/form';
import { Button } from '@sharedui/primitives/button';
import { useCreateEmailTemplateMutation } from '../../../../api/emailTemplates';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { besPaths } from '@sharedui/constants/paths';
import { useNavigate } from 'react-router-dom';

const CreateEmailTemplatePage = () => {
  const form = useForm<z.infer<typeof createEmailTemplateSchema>>({
    defaultValues,
    resolver: zodResolver(createEmailTemplateSchema),
  });
  const navigate = useNavigate();
  const [createEmailTemplate] = useCreateEmailTemplateMutation();

  const handleCreateTemplate = async (
    values: z.infer<typeof createEmailTemplateSchema>
  ) => {
    try {
      const payload = await createEmailTemplate(values).unwrap();
      toast.success(payload.message || 'Email template created successfully');
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
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button variant="secondary" size="sm" type="submit">
                Create email template
              </Button>
            </div>
          </PageSection>
        </form>
      </Form>
    </div>
  );
};

export default CreateEmailTemplatePage;
