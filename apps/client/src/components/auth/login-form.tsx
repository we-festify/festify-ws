import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@sharedui/primitives/card';
import { Label } from '@sharedui/primitives/label';
import { RadioGroup, RadioGroupItem } from '@sharedui/primitives/radio-group';
import { cn } from '@sharedui/utils/tw';

import RootUserLoginForm from './root-user-login-form';
import ManagedUserLoginForm from './managed-user-login-form';

export function LoginForm() {
  const [type, setType] = useState<'fws-root' | 'fws-user'>('fws-root');

  return (
    <Card className="mx-auto min-w-64">
      <CardHeader>
        <CardTitle className="text-xl">
          Login as {type === 'fws-root' ? 'root' : 'AIM'} user
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <RadioGroup
          defaultValue="fws-root"
          onValueChange={(value) => setType(value as 'fws-root' | 'fws-user')}
          className="flex w-full"
        >
          <div
            className={cn(
              'flex-1 max-w-48 flex space-x-2 p-2',
              type === 'fws-root'
                ? 'rounded-md ring-1 ring-muted-foreground'
                : '',
            )}
          >
            <RadioGroupItem
              value="fws-root"
              id="login-fws-root"
              className="flex-shrink-0"
            />
            <label htmlFor="login-fws-root">
              <div className="flex flex-col gap-2">
                <Label>Root User</Label>
                <p className="text-xs text-muted-foreground">
                  Root user with full access to the account
                </p>
              </div>
            </label>
          </div>
          <div
            className={cn(
              'flex-1 max-w-48 flex space-x-2 p-2',
              type === 'fws-user'
                ? 'rounded-md ring-1 ring-muted-foreground'
                : '',
            )}
          >
            <RadioGroupItem
              value="fws-user"
              id="login-fws-user"
              className="flex-shrink-0"
            />
            <label htmlFor="login-fws-user">
              <div className="flex flex-col gap-2">
                <Label>AIM User</Label>
                <p className="text-xs text-muted-foreground">
                  Users within an account with limited access
                </p>
              </div>
            </label>
          </div>
        </RadioGroup>
        {type === 'fws-root' ? <RootUserLoginForm /> : <ManagedUserLoginForm />}
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
