import { useUpdateCredsMutation } from '../../../../../api/instances';
import { Button } from '../../../../ui/button';
import { Input } from '../../../../ui/input';
import { Label } from '../../../../ui/label';
import useShowHide from '../../../../../hooks/useShowHide';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../../../utils/error';

const UpdateBESCredsDialogContent = ({
  instanceId,
  defaultValue,
}: {
  instanceId: string;
  defaultValue: any;
}) => {
  const [updateCreds, { isLoading }] = useUpdateCredsMutation();
  const { isVisible: isPasswordVisible, ToggleEye } = useShowHide();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('sender-email') as string;
    const password = formData.get('sender-password') as string;
    const smtpHost = formData.get('smtp-host') as string;
    const smtpPort = formData.get('smtp-port') as string;

    try {
      const payload = await updateCreds({
        serviceType: 'bes',
        instanceId: instanceId,
        creds: {
          email,
          password,
          smtpHost,
          smtpPort,
        },
      }).unwrap();
      toast.success(payload.message);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="sender-email">Sender Email</Label>
        <Input
          id="sender-email"
          name="sender-email"
          type="email"
          placeholder="leafpetal@example.com"
          autoComplete="off"
          required
          defaultValue={defaultValue?.email}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sender-password">Sender Password</Label>
        <div className="relative">
          <Input
            id="sender-password"
            name="sender-password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="off"
            required
          />
          <ToggleEye name="password" className="absolute top-0 right-0" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="smtp-host">SMTP Host</Label>
        <Input
          id="smtp-host"
          name="smtp-host"
          type="text"
          placeholder="smtp.example.com"
          required
          defaultValue={defaultValue?.smtpHost}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="smtp-port">SMTP Port</Label>
        <Input
          id="smtp-port"
          name="smtp-port"
          type="number"
          placeholder="587"
          required
          defaultValue={defaultValue?.smtpPort}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update'}
      </Button>
    </form>
  );
};

export default UpdateBESCredsDialogContent;
