import KeyValueList from '../../shared/components/custom/KeyValueList';
import { UpdateCredsDialog } from '../../shared/components/UpdateCredsDialog';
import { Button } from '../../shared/ui/button';

const InstanceCredsDetails = ({
  type,
  creds,
}: {
  type: string;
  creds: Record<string, any>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <KeyValueList title="Creds" data={creds} keys={keys} />
      <div className="flex flex-row-reverse mt-2">
        <UpdateCredsDialog
          type={type}
          trigger={<Button>Update Creds</Button>}
          instanceId={creds?.instance}
          defaultValue={creds}
        />
      </div>
    </div>
  );
};

const keys = [
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'password',
    label: 'Password',
    formatter: () => {
      return (
        <span className="text-sm text-muted-foreground">
          hidden for seurity reasons
        </span>
      );
    },
  },
  {
    key: 'smtpHost',
    label: 'SMTP Host',
  },
  {
    key: 'smtpPort',
    label: 'SMTP Port',
  },
];

export default InstanceCredsDetails;
