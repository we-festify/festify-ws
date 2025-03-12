import { BridgeApiEndpointMethod } from '@sharedtypes/bridge';
import FormSection from '@sharedui/components/form-section';
import { useMultiStepForm } from '@sharedui/components/multi-step-form';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Input } from '@sharedui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sharedui/primitives/select';

export const EndpointDetails = () => {
  const { form } = useMultiStepForm();

  return (
    <PageSection>
      <Card>
        <CardContent>
          <FormSection
            title="Endpoint details"
            description="Enter the details of the API endpoint that you want to create."
          >
            <div className="flex flex-col gap-6 pb-6">
              <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                  <FormFieldItem
                    label="Path"
                    description="The path of the endpoint should start with a forward slash (/)."
                    variant="aligned"
                  >
                    <Input
                      key="endpoint-path"
                      placeholder="/path"
                      {...field}
                      className="md:w-2/3"
                    />
                  </FormFieldItem>
                )}
              />
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormFieldItem
                    label="Method"
                    description="The HTTP method that the endpoint will respond to."
                    variant="aligned"
                  >
                    <div className="md:w-2/3">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a method" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(BridgeApiEndpointMethod).map(
                            (method: string) => (
                              <SelectItem key={method} value={method}>
                                {method}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
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
