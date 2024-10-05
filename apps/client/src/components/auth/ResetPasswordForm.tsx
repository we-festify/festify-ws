import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@sharedui/primitives/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@sharedui/primitives/card';
import { Form, FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Input } from '@sharedui/primitives/input';
import { getErrorMessage } from '@sharedui/utils/error';
import { useResetPasswordMutation } from '@rootui/api/auth';
import { setCredentials } from '@rootui/slices/auth';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { resetAccountPasswordSchema } from './schemas/resetPassword';

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm<z.infer<typeof resetAccountPasswordSchema>>({
    resolver: zodResolver(resetAccountPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onResetPasswordSubmit = async (
    values: z.infer<typeof resetAccountPasswordSchema>
  ) => {
    try {
      if (!token) {
        toast.error('Invalid token or token expired');
        return;
      }

      const response = await resetPassword({
        token,
        password: values.password,
      }).unwrap();
      toast.success(response.message);
      setCredentials(response);
      navigate('/console');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card className="mx-auto max-w-sm min-w-60">
      <CardHeader>
        <CardTitle className="text-xl">Reset Password for FWS</CardTitle>
        <CardDescription>
          Enter your new password and confirm password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid gap-4"
            onSubmit={form.handleSubmit(onResetPasswordSubmit)}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormFieldItem label="Password">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormFieldItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormFieldItem label="Confirm Password">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormFieldItem>
              )}
            />
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Reseting Password...' : 'Reset Password'}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Want to login?{' '}
          <Link to="/a/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
