import { Card, CardContent } from '@sharedui/primitives/card';
import PageSection from '@sharedui/components/page-section';
import FormSection from '@sharedui/components/form-section';
import { FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Input } from '@sharedui/primitives/input';
import { useMultiStepForm } from '@sharedui/components/multi-step-form';

const SMTPSettings = () => {
  const { form } = useMultiStepForm();

  return (
    <PageSection title="Simple Mail Transfer Protocol (SMTP) settings">
      <Card>
        <CardContent>
          <FormSection
            title="Set SMTP settings"
            description="Configure the SMTP settings for your instance. These settings will be used to send emails from your instance."
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="smtpHost"
                render={({ field }) => (
                  <FormFieldItem
                    label="SMTP host"
                    description="The host of the SMTP server that will be used to send emails from your instance."
                  >
                    <Input
                      key="smtp-host"
                      placeholder="smtp.ethereal.email"
                      {...field}
                    />
                  </FormFieldItem>
                )}
              />
              <FormField
                control={form.control}
                name="smtpPort"
                render={({ field }) => (
                  <FormFieldItem
                    label="SMTP port"
                    description="The port of the SMTP server that will be used to send emails from your instance."
                  >
                    <Input key="smtp-port" placeholder="587" {...field} />
                  </FormFieldItem>
                )}
              />
            </div>
          </FormSection>
        </CardContent>
      </Card>
    </PageSection>
  );
};

export default SMTPSettings;
