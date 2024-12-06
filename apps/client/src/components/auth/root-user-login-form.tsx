import { zodResolver } from '@hookform/resolvers/zod';
import { rootUserLoginSchema } from './schemas/login';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '@rootui/store/auth';
import { useLoginMutation } from '@rootui/api/auth';
import { getErrorMessage } from '@sharedui/utils/error';
import { toast } from 'sonner';
import { Form, FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Input } from '@sharedui/primitives/input';
import { Link } from 'react-router-dom';
import { Button } from '@sharedui/primitives/button';

const RootUserLoginForm = () => {
  const rootUserForm = useForm<z.infer<typeof rootUserLoginSchema>>({
    resolver: zodResolver(rootUserLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLoginFormSubmit = async (
    values: z.infer<typeof rootUserLoginSchema>,
  ) => {
    try {
      const payload = {
        user: {
          type: 'fws-root' as const,
          email: values.email,
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
    <Form {...rootUserForm}>
      <form
        className="grid gap-4"
        onSubmit={rootUserForm.handleSubmit(handleLoginFormSubmit)}
      >
        <FormField
          control={rootUserForm.control}
          name="email"
          render={({ field }) => (
            <FormFieldItem label="Root user email address">
              <Input
                key="fws-root-email"
                placeholder="username@example.com"
                autoComplete="email"
                type="email"
                {...field}
              />
            </FormFieldItem>
          )}
        />
        <FormField
          control={rootUserForm.control}
          name="password"
          render={({ field }) => (
            <FormFieldItem label="Password">
              <Input
                key="fws-root-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...field}
              />
            </FormFieldItem>
          )}
        />
        <Link to="/a/forgot-password" className="text-sm text-right">
          Forgot password?
        </Link>
        <Button type="submit" className="mt-4" disabled={isLoading}>
          Login
        </Button>
      </form>
    </Form>
  );
};

export default RootUserLoginForm;
