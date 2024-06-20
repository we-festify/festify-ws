import {
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
} from '@client/api/auth';
import { buttonVariants, Button } from '@client/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';
import useTimer from '@client/hooks/useTimer';
import { cn } from '@client/lib/utils';
import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

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

export function VerifyEmailForm() {
  const { time, setTime } = useTimer(0); // 0 seconds for the first time

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const location = useLocation();
  const email = location.state?.email;

  const [
    verifyEmail,
    { data: verifyData, error: verifyError, isLoading: isVerifying },
  ] = useVerifyEmailMutation();
  const [
    sendVerificationEmail,
    { data: sendData, error: sendError, isLoading: isSending },
  ] = useSendVerificationEmailMutation();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendVerificationEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');
    sendVerificationEmail(email);
    setTime(60);
  };

  useEffect(() => {
    setMessage('');
    setError('');
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    if (sendError && 'data' in sendError) {
      setError((sendError.data as any).message);
    }
    if (verifyError && 'data' in verifyError) {
      setError((verifyError.data as any).message);
    }
    if (sendData) {
      setMessage(sendData.message);
    }
    if (verifyData) {
      setMessage(verifyData.message);
    }
  }, [sendData, sendError, verifyData, verifyError]);

  return (
    <Card className="mx-auto max-w-sm min-w-60">
      <CardHeader>
        <CardTitle className="text-xl">Verify Email</CardTitle>
        <CardDescription>
          {isSending
            ? 'Sending verification email...'
            : isVerifying
            ? 'Verifying email...'
            : message
            ? message
            : error
            ? error
            : 'We have sent a verification email to your email address. Please click on the link in the email to verify your email address.'}
        </CardDescription>
      </CardHeader>
      {!verifyData && !isVerifying && (
        <CardContent>
          <form onSubmit={handleSendVerificationEmail} className="grid gap-4">
            <TimedButton time={time} type="submit" />
          </form>
        </CardContent>
      )}
      {verifyData && (
        <CardContent>
          <Link
            to="/a/login"
            className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
          >
            Login
          </Link>
        </CardContent>
      )}
    </Card>
  );
}
