import { useReadAccountSummaryQuery } from '@aim-ui/api/general';
import ErrorBox from '@sharedui/components/error-box';
import KeyValueGrid from '@sharedui/components/key-value-grid';
import { aimPaths } from '@sharedui/constants/paths';
import { Button } from '@sharedui/primitives/button';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { RotateCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResourcesSummary = () => {
  const {
    data: accountSummary,
    refetch,
    error,
    isError,
  } = useReadAccountSummaryQuery(undefined);

  return (
    <Card>
      <CardHeader variant="muted">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Resources</h2>
          <Button
            name="Refresh instances"
            size="sm"
            variant="outline"
            onClick={refetch}
          >
            <RotateCw size={16} className="text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isError ? (
          <ErrorBox error={error} />
        ) : (
          <KeyValueGrid
            data={accountSummary ?? {}}
            keys={resourcesSummaryKeys}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ResourcesSummary;

const resourcesSummaryKeys = [
  {
    key: 'managedUsersCount',
    label: 'Managed users',
    formatter: (value: unknown) => {
      return (
        <Link
          to={aimPaths.USERS}
          className="text-blue-700 dark:text-blue-500 hover:underline text-xl font-semibold"
        >{`${value}`}</Link>
      );
    },
  },
  {
    key: 'permissionPoliciesCount',
    label: 'Permission policies',
    formatter: (value: unknown) => {
      return (
        <Link
          to={aimPaths.POLICIES}
          className="text-blue-700 dark:text-blue-500 hover:underline text-xl font-semibold"
        >{`${value}`}</Link>
      );
    },
  },
  {
    key: 'accessKeysCount',
    label: 'User access keys',
    formatter: (value: unknown) => {
      return (
        <Link
          to={aimPaths.USERS}
          className="text-blue-700 dark:text-blue-500 hover:underline text-xl font-semibold"
        >{`${value}`}</Link>
      );
    },
  },
];
