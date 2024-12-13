import { useAuth } from '@rootui/providers/auth-provider';
import CopyIcon from '@sharedui/components/copy-icon';
import KeyValueGrid from '@sharedui/components/key-value-grid';
import paths from '@sharedui/constants/paths';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';

const AccountInformationCard = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader variant="muted">
        <h2 className="text-lg font-semibold">Account</h2>
      </CardHeader>
      <CardContent>
        <KeyValueGrid data={user ?? {}} keys={accountInfoKeys} />
      </CardContent>
    </Card>
  );
};

export default AccountInformationCard;

const accountInfoKeys = [
  { key: 'alias', label: 'Alias' },
  { key: 'accountId', label: 'Account ID' },
  {
    key: 'accountId',
    label: 'Sign-in url',
    formatter: (value: unknown) => {
      const url = `${window.location.origin}${paths.root.AUTH}/login?accountId=${value}`;
      return (
        <span>
          <CopyIcon value={url} className="h-min p-0" />
          <span className="ml-2">{url}</span>
        </span>
      );
    },
  },
  {
    key: 'type',
    label: 'Account type',
    formatter: (value: unknown) => {
      if (value === 'fws-root') {
        return 'Root';
      }
      return 'Managed';
    },
  },
];
