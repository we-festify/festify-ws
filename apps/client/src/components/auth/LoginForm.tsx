import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@sharedui/primitives/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@sharedui/primitives/card';
import { Form, FormField, FormFieldItem } from '@sharedui/primitives/form';
import { Input } from '@sharedui/primitives/input';
import { Label } from '@sharedui/primitives/label';
import { RadioGroup, RadioGroupItem } from '@sharedui/primitives/radio-group';
import { getErrorMessage } from '@sharedui/utils/error';
import { cn } from '@sharedui/utils/tw';
import { useLoginMutation } from '@rootui/api/auth';
import { setCredentials } from '@rootui/slices/auth';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { rootUserLoginSchema, aimUserLoginSchema } from './schemas/login';

export function LoginForm() {
  const navigate = useNavigate();
  const [type, setType] = useState<'root' | 'aim'>('root');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const rootUserForm = useForm<z.infer<typeof rootUserLoginSchema>>({
    resolver: zodResolver(rootUserLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const aimUserForm = useForm<z.infer<typeof aimUserLoginSchema>>({
    resolver: zodResolver(aimUserLoginSchema),
    defaultValues: {
      accountId: '',
      alias: '',
      password: '',
    },
  });

  const handleLoginFormSubmit = async (
    values:
      | z.infer<typeof rootUserLoginSchema>
      | z.infer<typeof aimUserLoginSchema>
  ) => {
    try {
      const payload = {
        ...values,
        type,
      };
      const response = await login(payload).unwrap();
      toast.success(response.message);
      const { isPasswordResetRequired, resetPasswordToken } = response;
      if (isPasswordResetRequired) {
        // navigate to reset password page
        navigate(`/a/reset-password?token=${resetPasswordToken}`);
      } else {
        dispatch(setCredentials(response));
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <Card className="mx-auto min-w-64">
      <CardHeader>
        <CardTitle className="text-xl">
          Login as {type === 'root' ? 'root' : 'AIM'} user
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <RadioGroup
          defaultValue="root"
          onValueChange={(value) => setType(value as 'root' | 'aim')}
          className="flex w-full"
        >
          <div
            className={cn(
              'flex-1 max-w-48 flex space-x-2 p-2',
              type === 'root' ? 'rounded-md ring-1 ring-muted-foreground' : ''
            )}
          >
            <RadioGroupItem
              value="root"
              id="login-root"
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-root">Root User</Label>
              <p className="text-xs text-muted-foreground">
                Root user with full access to the account
              </p>
            </div>
          </div>
          <div
            className={cn(
              'flex-1 max-w-48 flex space-x-2 p-2',
              type === 'aim' ? 'rounded-md ring-1 ring-muted-foreground' : ''
            )}
          >
            <RadioGroupItem
              value="aim"
              id="login-aim"
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-aim">AIM User</Label>
              <p className="text-xs text-muted-foreground">
                Users within an account with limited access
              </p>
            </div>
          </div>
        </RadioGroup>
        {type === 'root' ? (
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
                      key="root-email"
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
                      key="root-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormFieldItem>
                )}
              />
              <Button type="submit" className="mt-4" disabled={isLoading}>
                Login
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...aimUserForm}>
            <form
              onSubmit={aimUserForm.handleSubmit(handleLoginFormSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={aimUserForm.control}
                name="accountId"
                render={({ field }) => (
                  <FormFieldItem label="Account ID">
                    <Input
                      key="aim-account-id"
                      placeholder="24-character account id"
                      autoComplete="account-id"
                      {...field}
                    />
                  </FormFieldItem>
                )}
              />
              <FormField
                control={aimUserForm.control}
                name="password"
                render={({ field }) => (
                  <FormFieldItem label="Password">
                    <Input
                      key="aim-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormFieldItem>
                )}
              />
              <FormField
                control={aimUserForm.control}
                name="alias"
                render={({ field }) => (
                  <FormFieldItem label="FWS account alias">
                    <Input
                      key="aim-alias"
                      placeholder="username"
                      autoComplete="username"
                      {...field}
                    />
                  </FormFieldItem>
                )}
              />
              <Button type="submit" className="mt-4" disabled={isLoading}>
                Login
              </Button>
            </form>
          </Form>
        )}
        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/a/register" className="underline">
            Sign Up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
