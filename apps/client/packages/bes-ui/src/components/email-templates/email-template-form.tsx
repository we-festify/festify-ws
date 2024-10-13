import FormSection from '@sharedui/components/form-section';
import { FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Input } from '@sharedui/primitives/input';
import { useForm } from 'react-hook-form';
import EmailTemplateBodyInput from './email-template-body-input';

interface EmailTemplate {
  name: string;
  subject: string;
  body: string;
}

interface EmailTemplateFormProps {
  form: ReturnType<typeof useForm<EmailTemplate>>;
}

const EmailTemplateForm = ({ form }: EmailTemplateFormProps) => {
  return (
    <FormSection
      title="Email template details"
      description="You can create an email template that can be used to send personalized emails to one or more destinations without having to write the email content each time."
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormFieldItem
              label="Template name"
              description="The unique name of the email template that will be used to identify it in the system."
              variant="aligned"
            >
              <Input
                key="template-name"
                placeholder="unique name"
                {...field}
                className="md:w-2/3"
              />
            </FormFieldItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormFieldItem
              label="Subject of the email"
              description="The subject of the email that will be sent to the recipients."
              variant="aligned"
            >
              <Input
                key="email-subject"
                placeholder="subject"
                {...field}
                className="md:w-2/3"
              />
            </FormFieldItem>
          )}
        />
      </div>
      <EmailTemplateBodyInput form={form} />
    </FormSection>
  );
};

export default EmailTemplateForm;
