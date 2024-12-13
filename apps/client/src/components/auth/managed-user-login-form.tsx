import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { managedUserLoginSchema } from './schemas/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { Form, FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Input } from '@sharedui/primitives/input';
import { useLoginMutation } from '@rootui/api/auth';
import { setAccessToken } from '@rootui/store/auth';
import useSearchParam from '@sharedui/hooks/useSearchParam';
import { LoadingButton } from '@sharedui/components/loading-button';

const ManagedUserLoginForm = () => {
  const accountId = useSearchParam('accountId');
  const managedUserForm = useForm<z.infer<typeof managedUserLoginSchema>>({
    resolver: zodResolver(managedUserLoginSchema),
    defaultValues: {
      accountId: accountId ?? '',
      alias: '',
      password: '',
    },
  });
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLoginFormSubmit = async (
    values: z.infer<typeof managedUserLoginSchema>,
  ) => {
    try {
      const payload = {
        user: {
          type: 'fws-user' as const,
          accountId: values.accountId,
          alias: values.alias,
          password: values.password,
        },
      };
      const response = await login(payload).unwrap();
      const { token } = response;
      dispatch(setAccessToken(token));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };
  return (
    <Form {...managedUserForm}>
      <form
        onSubmit={managedUserForm.handleSubmit(handleLoginFormSubmit)}
        className="grid gap-4"
      >
        <FormField
          control={managedUserForm.control}
          name="accountId"
          render={({ field }) => (
            <FormFieldItem label="Account ID">
              <Input
                key="fws-user-account-id"
                placeholder="24-character account id"
                autoComplete="fws-user-account-id"
                {...field}
              />
            </FormFieldItem>
          )}
        />
        <FormField
          control={managedUserForm.control}
          name="alias"
          render={({ field }) => (
            <FormFieldItem label="Account alias">
              <Input
                key="fws-user-alias"
                placeholder="username"
                autoComplete="username"
                {...field}
              />
            </FormFieldItem>
          )}
        />
        <FormField
          control={managedUserForm.control}
          name="password"
          render={({ field }) => (
            <FormFieldItem label="Password">
              <Input
                key="fws-user-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...field}
              />
            </FormFieldItem>
          )}
        />
        <LoadingButton type="submit" className="mt-4" loading={isLoading}>
          Login
        </LoadingButton>
      </form>
    </Form>
  );
};

export default ManagedUserLoginForm;
