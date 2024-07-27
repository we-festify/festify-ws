import { Card, CardContent } from '../../../../shared/ui/card';
import PageSection from '../../../../shared/components/PageSection';
import FormSection from '../../../../shared/components/FormSection';
import { FormField, FormFieldItem } from '../../../../shared/ui/form';
import { Input } from '../../../../shared/ui/input';
import { useMultiStepForm } from '../../../../shared/components/MultiStepForm';

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
