import { FormField, FormFieldItem } from '../../../primitives/form';
import { Input } from '../../../primitives/input';
import MultiStepForm, {
  MultiStepFormStep,
  useMultiStepForm,
} from '../../multi-step-form';
import { z } from 'zod';
import { PageContent, PageLayout, PageSideNav } from '../../page-layout';
import { RadioGroup, RadioGroupItem } from '../../../primitives/radio-group';
import { Label } from '../../../primitives/label';
import { Card, CardContent } from '../../../primitives/card';
import FormSection from '../../form-section';

const schema = z
  .object({
    alias: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Name must only contain letters, numbers, - and _',
      ),
    passwordType: z.enum(['auto', 'manual']),
    password: z.string(),
  })
  .refine(
    (data) => {
      if (data.passwordType === 'manual') {
        return !!data.password && data.password.length > 0;
      }
      return true;
    },
    {
      message: 'Password is required when password type is manual',
      path: ['password'],
    },
  );

const Step1 = () => {
  const { form } = useMultiStepForm();

  return (
    <div className="flex flex-col gap-4">
      {/* <div className=" bg-white shadow-md rounded-md p-6">
        
      </div> */}
      <Card>
        <CardContent>
          <FormSection
            title="Set user details"
            description="Create a user with a unique alias to identify them in the FWS management console."
          >
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormFieldItem label="Alias" variant="aligned">
                  <div className="w-2/3">
                    <Input key="alias" placeholder="alias" {...field} />
                  </div>
                </FormFieldItem>
              )}
            />
          </FormSection>
          <FormSection
            title="Set password details"
            description="Create a password that allows the user to log in to the FWS management console."
          >
            <FormField
              control={form.control}
              name="passwordType"
              render={({ field }) => (
                <FormFieldItem label="Password Type" variant="aligned">
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <div className="space-y-4 py-2 w-2/3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="auto"
                            checked={field.value === 'auto'}
                            id="password-type-auto"
                          />
                          <Label htmlFor="password-type-auto">
                            Auto generated password
                          </Label>
                        </div>
                        <p className="text-muted-foreground text-xs pl-6">
                          A random password will be generated for the user to
                          log in to the FWS management console.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="manual"
                            checked={field.value === 'manual'}
                            id="password-type-manual"
                          />
                          <Label htmlFor="password-type-manual">
                            Custom password
                          </Label>
                        </div>
                        <p className="text-muted-foreground text-xs pl-6">
                          Set a custom password for the user to log in to the
                          FWS management console.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </FormFieldItem>
              )}
            />
            {form.watch('passwordType') === 'manual' && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormFieldItem label="Password" variant="aligned">
                    <div className="w-2/3">
                      <Input
                        key="password"
                        placeholder="password"
                        autoComplete="new-password"
                        type="password"
                        {...field}
                      />
                    </div>
                  </FormFieldItem>
                )}
              />
            )}
          </FormSection>
        </CardContent>
      </Card>
    </div>
  );
};

const Step2 = () => {
  return null;
};

const steps: MultiStepFormStep[] = [
  {
    title: 'Basic Info',
    component: <Step1 />,
    validateNext: (form) => {
      return form.trigger(['alias', 'passwordType', 'password']);
    },
  },
  { title: 'Permissions', component: <Step2 /> },
];

const defaultValues = {
  alias: '' as string,
  passwordType: 'auto' as 'auto' | 'manual',
  password: '' as string,
};

const MultiStepFormDemo = () => {
  return (
    <PageLayout>
      <PageSideNav
        title="Basic Email service"
        subTitle="User Guide"
        items={[
          {
            title: 'What is BES?',
            path: 'userguide/welcome',
          },
          {
            title: 'Getting Started',
            path: 'userguide/getting-started/index',
            children: [
              {
                title: 'Installation',
                path: 'userguide/getting-started/installation',
              },
              {
                title: 'Configuration',
                path: 'userguide/getting-started/configuration',
                children: [
                  {
                    title: 'Basic Configuration',
                    path: 'userguide/getting-started/configuration/basic',
                  },
                  {
                    title: 'Advanced Configuration Of BES',
                    path: 'userguide/getting-started/configuration/advanced',
                  },
                ],
              },
            ],
          },
        ]}
      />
      <PageContent>
        <MultiStepForm
          className="mx-auto p-6"
          title="Add User"
          schema={schema}
          steps={steps}
          defaultValues={defaultValues}
        />
      </PageContent>
    </PageLayout>
  );
};

export default MultiStepFormDemo;
