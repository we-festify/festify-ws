import { Card, CardContent } from '@sharedui/primitives/card';
import PageSection from '@sharedui/components/page-section';
import FormSection from '@sharedui/components/form-section';
import { FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Input } from '@sharedui/primitives/input';
import { useMultiStepForm } from '@sharedui/components/multi-step-form';

const PolicyDetails = () => {
  const { form } = useMultiStepForm();

  return (
    <PageSection>
      <Card>
        <CardContent>
          <FormSection
            title="Enter policy details"
            description="Enter the alias for your policy. This will be used to identify your policy in the FWS management console."
          >
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormFieldItem
                  label="Alias"
                  description="The alias for your policy is a unique name among all your policies. You can change it later if you want."
                  variant="aligned"
                >
                  <div className="md:w-1/2">
                    <Input key="alias" placeholder="alias" {...field} />
                  </div>
                </FormFieldItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormFieldItem
                  label="Description"
                  description="The description for your policy is a brief summary of what the policy does."
                  variant="aligned"
                >
                  <Input
                    key="description"
                    placeholder="description"
                    {...field}
                  />
                </FormFieldItem>
              )}
            />
          </FormSection>
        </CardContent>
      </Card>
    </PageSection>
  );
};

export default PolicyDetails;
