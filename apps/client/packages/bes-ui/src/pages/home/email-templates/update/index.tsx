import EmailTemplateForm from '../../../../components/email-templates/email-template-form';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { useForm } from 'react-hook-form';
import { updateEmailTemplateSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@sharedui/primitives/form';
import { Button } from '@sharedui/primitives/button';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useReadEmailTemplateQuery,
  useUpdateEmailTemplateMutation,
} from '../../../../api/email-templates';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { besPaths } from '@sharedui/constants/paths';
import { useAuth } from '@rootui/providers/auth-provider';
import { generateFRN } from '@sharedui/utils/frn';

const UpdateEmailTemplatePage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { user } = useAuth();
  const frn = generateFRN(
    'bes',
    user?.accountId ?? '',
    'template',
    templateId ?? '',
  );
  const { data: { template } = {} } = useReadEmailTemplateQuery(frn);
  const form = useForm<z.infer<typeof updateEmailTemplateSchema>>({
    defaultValues: template,
    resolver: zodResolver(updateEmailTemplateSchema),
  });
  const navigate = useNavigate();
  const [updateEmailTemplate] = useUpdateEmailTemplateMutation();

  const handleUpdateTemplate = async (
    values: z.infer<typeof updateEmailTemplateSchema>,
  ) => {
    if (!template) return;

    try {
      await updateEmailTemplate({
        frn,
        template: values,
      }).unwrap();
      toast.success('Email template updated successfully');
      navigate(`${besPaths.EMAIL_TEMPLATE_DETAILS}/${template._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8 m-auto max-w-[1024px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateTemplate)}>
          <PageSection
            title="Update email template"
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
                Update email template
              </Button>
            </div>
          </PageSection>
        </form>
      </Form>
    </div>
  );
};

export default UpdateEmailTemplatePage;
