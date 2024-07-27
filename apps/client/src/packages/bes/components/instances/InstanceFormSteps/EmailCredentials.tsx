import { Card, CardContent } from '../../../../shared/ui/card';
import PageSection from '../../../../shared/components/PageSection';
import FormSection from '../../../../shared/components/FormSection';
import { FormField, FormFieldItem } from '../../../../shared/ui/form';
import { Input } from '../../../../shared/ui/input';
import { useMultiStepForm } from '../../../../shared/components/MultiStepForm';

const EmailCredentials = () => {
  const { form } = useMultiStepForm();

  return (
    <PageSection>
      <Card>
        <CardContent>
          <FormSection
            title="Provide your email credentials"
            description="Enter the email credentials that will be used to send emails from your instance. The email address must be verified before you can send emails through Festify BES."
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="senderName"
                render={({ field }) => (
                  <FormFieldItem
                    label="Sender name"
                    description="The name that will be displayed as the sender of the email when it is received."
                  >
                    <Input key="sender-name" placeholder="name" {...field} />
                  </FormFieldItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderEmail"
                render={({ field }) => (
                  <FormFieldItem
                    label="Sender email"
                    description="The email address that will be used to send emails from your instance."
                  >
                    <Input
                      key="sender-email"
                      placeholder="username@example.com"
                      {...field}
                    />
                  </FormFieldItem>
                )}
              />
              <FormField
                control={form.control}
                name="senderPassword"
                render={({ field }) => (
                  <FormFieldItem
                    label="Sender password"
                    description="The password for the email address that will be used to authenticate the sender."
                  >
                    <Input
                      key="sender-password"
                      placeholder="password"
                      type="password"
                      autoComplete="off"
                      {...field}
                    />
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

export default EmailCredentials;
