import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Button } from '@sharedui/primitives/button';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { methodsPaths } from '@sharedui/constants/paths';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@sharedui/components/loading-button';
import FormSection from '@sharedui/components/form-section';
import { Input } from '@sharedui/primitives/input';
import { MethodsHandlerRuntime } from '@sharedtypes/methods';
import { useCreateHandlerMutation } from '@methods-ui/api/handlers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sharedui/primitives/select';

const RUNTIME_OPTIONS = {
  [MethodsHandlerRuntime.NODEJS]: 'Node.js',
} as const;

const schema = z.object({
  alias: z.string().min(3).max(50),
  description: z.string().min(0).max(500),
  timeoutInSeconds: z.coerce.number().int().min(1).max(30),
  memoryInMB: z.coerce.number().int().min(8).max(128),

  runtime: z.nativeEnum(MethodsHandlerRuntime),

  codeSource: z.string().max(5000),
});

type SchemaValues = z.infer<typeof schema>;

const defaultValues: SchemaValues = {
  alias: '',
  description: '',
  timeoutInSeconds: 3,
  memoryInMB: 8,
  runtime: MethodsHandlerRuntime.NODEJS,
  codeSource: `const main = async (event) => {
  // TODO implement
  const response = {
    statusCode: 200,
    body: 'Hello from Methods!',
  };
  return response;
};
`,
};

export const CreateHandlerPage = () => {
  const form = useForm<SchemaValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const navigate = useNavigate();
  const [createHandler, { isLoading }] = useCreateHandlerMutation();

  const handleCreateTemplate = async (values: SchemaValues) => {
    try {
      await createHandler(values).unwrap();
      toast.success('Handler created successfully');
      form.reset();
      navigate(methodsPaths.HANDLER_DETAILS(values.alias), { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8 m-auto max-w-[1024px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateTemplate)}>
          <PageSection
            title="Create Handler"
            description="Handlers are serverless functions that you can invoke to interact with your services."
          >
            <div className="space-y-4">
              <Card>
                <CardContent>
                  <FormSection
                    title="Handler details"
                    description="Enter the basic details of the handler to identify it in the system."
                  >
                    <div className="flex flex-col gap-6 pb-6">
                      <FormField
                        control={form.control}
                        name="alias"
                        render={({ field }) => (
                          <FormFieldItem
                            label="Alias"
                            description="The unique name of the handler that will be used to identify it in the system."
                            variant="aligned"
                          >
                            <Input
                              key="alias"
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
                            description="The description of the handler is helpful to understand the purpose of the handler."
                            variant="aligned"
                          >
                            <Input
                              key="description"
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
              <Card>
                <CardContent>
                  <FormSection
                    title="Handler configuration"
                    description="The configuration of the handler defines the runtime environment and the resources available to the handler."
                  >
                    <div className="flex flex-col gap-6 pb-6">
                      <FormField
                        control={form.control}
                        name="runtime"
                        render={({ field }) => (
                          <FormFieldItem
                            label="Runtime"
                            description="The runtime environment in which the handler will execute."
                            variant="aligned"
                          >
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select runtime" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(MethodsHandlerRuntime).map(
                                  (runtime: MethodsHandlerRuntime) => (
                                    <SelectItem key={runtime} value={runtime}>
                                      {RUNTIME_OPTIONS[runtime]}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                          </FormFieldItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="timeoutInSeconds"
                        render={({ field }) => (
                          <FormFieldItem
                            label="Timeout"
                            description="The maximum time in seconds the handler can run before it is terminated."
                            variant="aligned"
                          >
                            <Input
                              key="timeoutInSeconds"
                              type="number"
                              step={1}
                              {...field}
                              className="md:w-2/3"
                            />
                          </FormFieldItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="memoryInMB"
                        render={({ field }) => (
                          <FormFieldItem
                            label="Memory"
                            description="The amount of memory in MB available to the handler."
                            variant="aligned"
                          >
                            <Input
                              key="memoryInMB"
                              type="number"
                              step={8}
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
            </div>
            <div className="flex justify-end mt-4 gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(methodsPaths.HANDLERS, { replace: true });
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
                Create Handler
              </LoadingButton>
            </div>
          </PageSection>
        </form>
      </Form>
    </div>
  );
};
