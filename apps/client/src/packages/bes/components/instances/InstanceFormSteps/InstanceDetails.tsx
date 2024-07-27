import { Card, CardContent } from '../../../../shared/ui/card';
import PageSection from '../../../../shared/components/PageSection';
import FormSection from '../../../../shared/components/FormSection';
import { FormField, FormFieldItem } from '../../../../shared/ui/form';
import { Input } from '../../../../shared/ui/input';
import { useMultiStepForm } from '../../../../shared/components/MultiStepForm';

const InstanceDetails = () => {
  const { form } = useMultiStepForm();

  return (
    <PageSection>
      <Card>
        <CardContent>
          <FormSection
            title="Enter instance details"
            description="Enter the alias for your instance. This will be used to identify your instance in the FWS management console."
          >
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormFieldItem
                  label="Alias"
                  description="The alias for your instance is a unique name among all your instances. You can change it later if you want."
                  variant="aligned"
                >
                  <div className="md:w-1/2">
                    <Input key="alias" placeholder="alias" {...field} />
                  </div>
                </FormFieldItem>
              )}
            />
          </FormSection>
        </CardContent>
      </Card>
    </PageSection>
  );
};

export default InstanceDetails;
