import { Card, CardContent, CardHeader } from '../../../../shared/ui/card';
import PageSection from '../../../../shared/components/PageSection';
import FormSection from '../../../../shared/components/FormSection';
import { Button } from '../../../../shared/ui/button';
import { useMultiStepForm } from '../../../../shared/components/MultiStepForm';
import KeyValueGrid from '../../../../shared/components/ui/KeyValueGrid';

const ReviewAndCreate = () => {
  const { form, goToStep } = useMultiStepForm();

  return (
    <PageSection>
      <FormSection
        title="Review and create your instance"
        description="Review the information you have provided and create your instance."
      >
        <div className="flex flex-col gap-8">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardHeader variant="muted">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">{step.title}</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-20"
                    onClick={() => goToStep(step.index)}
                  >
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <KeyValueGrid data={form.getValues()} keys={step.keys} />
              </CardContent>
            </Card>
          ))}
        </div>
      </FormSection>
    </PageSection>
  );
};

const steps = [
  {
    index: 0,
    title: 'Instance details',
    keys: [{ key: 'alias', label: 'Alias' }],
  },
  {
    index: 1,
    title: 'Email credentials',
    keys: [
      { key: 'senderName', label: 'Sender name' },
      { key: 'senderEmail', label: 'Sender email address' },
      {
        key: 'senderPassword',
        label: 'Sender password',
        formatter: (value: string) => (
          <span className="text-muted-foreground text-xs">
            hidden for security reasons
          </span>
        ),
      },
    ],
  },
  {
    index: 2,
    title: 'SMTP settings',
    keys: [
      { key: 'smtpHost', label: 'SMTP host' },
      { key: 'smtpPort', label: 'SMTP port' },
    ],
  },
];

export default ReviewAndCreate;
