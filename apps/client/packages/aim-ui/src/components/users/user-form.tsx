import FormSection from '@sharedui/components/form-section';
import { FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Input } from '@sharedui/primitives/input';
import { useForm } from 'react-hook-form';

interface ManagedUser {
  alias: string;
  password: string;
}

interface UserFormProps {
  form: ReturnType<typeof useForm<ManagedUser>>;
}

const UserForm = ({ form }: UserFormProps) => {
  return (
    <FormSection
      title="User details"
      description="You can create a user that can be used to interact with the system with less permissions."
    >
      <div className="flex flex-col gap-6 pb-6">
        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormFieldItem
              label="User alias"
              description="The unique name of the user that will be used to identify it in the system."
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
          name="password"
          render={({ field }) => (
            <FormFieldItem
              label="Password"
              description="The password of the user that will be used to authenticate it in the system."
              variant="aligned"
            >
              <Input
                key="password"
                placeholder="secret password"
                {...field}
                className="md:w-2/3"
              />
            </FormFieldItem>
          )}
        />
      </div>
    </FormSection>
  );
};

export default UserForm;
