import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Button } from '@sharedui/primitives/button';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { bridgePaths } from '@sharedui/constants/paths';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@sharedui/components/loading-button';
import { useCreateApiMutation } from '@bridge-ui/api/apis';
import FormSection from '@sharedui/components/form-section';
import { Input } from '@sharedui/primitives/input';

const schema = z.object({
  alias: z.string().min(3).max(50),
  description: z.string().min(3).max(255),
});

export const CreateApiPage = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      alias: '',
      description: '',
    },
  });
  const navigate = useNavigate();
  const [createApi, { isLoading }] = useCreateApiMutation();

  const handleCreateTemplate = async (values: z.infer<typeof schema>) => {
    try {
      await createApi(values).unwrap();
      toast.success('API created successfully');
      form.reset();
      navigate(bridgePaths.APIS, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8 m-auto max-w-[1024px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateTemplate)}>
          <PageSection
            title="Create API"
            description="Create an API that can be used to interact with your services."
          >
            <Card>
              <CardContent>
                <FormSection
                  title="API details"
                  description="Enter the details of the API that you want to create. Endpoints can be added to the API after it is created."
                >
                  <div className="flex flex-col gap-6 pb-6">
                    <FormField
                      control={form.control}
                      name="alias"
                      render={({ field }) => (
                        <FormFieldItem
                          label="Alias"
                          description="The unique name of the API that will be used to identify it in the system."
                          variant="aligned"
                        >
                          <Input
                            key="api-alias"
                            placeholder="unique name"
                            {...field}
                            className="md:w-2/3"
                          />
                        </FormFieldItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormFieldItem
                          label="Description"
                          description="The description of the API is helpful to understand the purpose of the API."
                          variant="aligned"
                        >
                          <Input
                            key="api-description"
                            placeholder="description"
                            {...field}
                            className="md:w-2/3"
                          />
                        </FormFieldItem>
                      )}
                    />
                  </div>
                </FormSection>
              </CardContent>
            </Card>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(bridgePaths.APIS, { replace: true });
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="secondary"
                size="sm"
                type="submit"
                loading={isLoading}
              >
                Create API
              </LoadingButton>
            </div>
          </PageSection>
        </form>
      </Form>
    </div>
  );
};
