import { Link } from 'react-router-dom';

import { Button } from '../../packages/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../packages/shared/ui/card';
import { Input } from '../../packages/shared/ui/input';
import { Label } from '../../packages/shared/ui/label';
import { useForgotPasswordMutation } from '../../api/auth';
import { toast } from 'sonner';
import useTimer from '../../packages/shared/hooks/useTimer';

type TimedButtonProps = {
  time: number;
} & React.ComponentProps<typeof Button>;

const TimedButton: React.FC<TimedButtonProps> = ({ time, disabled }) => {
  return (
    <Button disabled={time > 0 ? true : disabled} className="w-full">
      {time === 0 ? 'Resend Email' : `Resend in ${time}s`}
    </Button>
  );
};

export function ForgotPasswordForm() {
  const { time, setTime } = useTimer(0); // 0 seconds for the first time

  const [sendForgotPasswordEmail] = useForgotPasswordMutation();

  const handleForgotPaswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email') as string;

    setTime(60);
    toast.promise(sendForgotPasswordEmail(email).unwrap(), {
      loading: 'Sending forgot password email...',
      success: (data) => data?.message,
      error: (error) => error?.data?.message,
    });
  };

  return (
    <Card className="mx-auto max-w-sm min-w-60">
      <CardHeader>
        <CardTitle className="text-xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email below to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleForgotPaswordSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="leafpetal@example.com"
              autoComplete="email"
              required
            />
          </div>
          <TimedButton time={time} type="submit" />
        </form>
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
