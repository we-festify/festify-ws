import {
  useReadPolicyQuery,
  useDeletePoliciesMutation,
  useAttachUsersPolicyMutation,
  useDetachUsersPolicyMutation,
} from '@aim-ui/api/policies';
import {
  useListManagedUsersQuery,
  useListPolicyAttachedUsersQuery,
} from '@aim-ui/api/users';
import { columns as policyColumns } from '@aim-ui/components/policies/policy-rules-table-columns';
import { columns as userColumns } from '@aim-ui/components/users/users-table/columns';
import { useAuth } from '@rootui/providers/auth-provider';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import {
  IPermissionPolicy,
  IPermissionPolicyRule,
} from '@sharedtypes/aim/permission-policy';
import CopyIcon from '@sharedui/components/copy-icon';
import ErrorBox from '@sharedui/components/error-box';
import KeyValueGrid from '@sharedui/components/key-value-grid';
import PageSection from '@sharedui/components/page-section';
import { aimPaths } from '@sharedui/constants/paths';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { DataTable } from '@sharedui/primitives/data-table';
import { getErrorMessage } from '@sharedui/utils/error';
import { generateFRN, readableFRN } from '@sharedui/utils/frn';
import { formatTimeAgoFromNow } from '@sharedui/utils/time';
import { cn } from '@sharedui/utils/tw';
import { Row, Table } from '@tanstack/react-table';
import { RotateCw } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const PermissionPolicyDetailsPage = () => {
  const { alias } = useParams<{ alias: string }>();
  const { user } = useAuth();
  const policyFrn = generateFRN(
    'aim',
    user?.accountId ?? '',
    'policy',
    alias ?? '',
  );
  const {
    data: { policy } = {},
    refetch: refetchPolicy,
    error: readPolicyError,
  } = useReadPolicyQuery(policyFrn);
  const navigate = useNavigate();
  const [deletePermissionPolicys] = useDeletePoliciesMutation();
  const { data: { users } = {} } = useListManagedUsersQuery(undefined);
  const {
    data: { users: attachedUsers } = {},
    refetch: refetchAttachedUsers,
    error: listAttachedUsersError,
  } = useListPolicyAttachedUsersQuery(policyFrn);
  const nonAttachedUsers = users?.filter(
    (user) =>
      !attachedUsers?.find((attachedUser) => attachedUser._id === user._id),
  );
  const [attachUsersToPolicy] = useAttachUsersPolicyMutation();
  const [detachUsersFromPolicy] = useDetachUsersPolicyMutation();

  const handleDeletePolicy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!policy) return;

    try {
      await deletePermissionPolicys([policyFrn]).unwrap();
      toast.success('Policy deleted successfully');
      navigate(aimPaths.POLICIES);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRefreshPolicy = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    try {
      await refetchPolicy().unwrap();
      await refetchAttachedUsers().unwrap();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleAttachUsers = async (
    e: React.MouseEvent<HTMLButtonElement>,
    users: IManagedUser[],
  ) => {
    e.preventDefault();
    if (!alias) return;
    try {
      const userFrns = users.map((u) =>
        generateFRN('aim', user?.accountId ?? '', 'user', u.alias),
      );
      await attachUsersToPolicy({ userFrns, policyFrn }).unwrap();
      toast.success('Users attached successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDetachUsers = async (
    e: React.MouseEvent<HTMLButtonElement>,
    users: IManagedUser[],
  ) => {
    e.preventDefault();
    if (!alias) return;
    try {
      const userFrns = users.map((u) =>
        generateFRN('aim', user?.accountId ?? '', 'user', u.alias),
      );
      await detachUsersFromPolicy({ userFrns, policyFrn }).unwrap();
      toast.success('Users detached successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRefreshAttachedUsers = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    try {
      await refetchAttachedUsers().unwrap();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8">
      <PageSection
        title={policy?.alias}
        description={
          policy
            ? `Created ${formatTimeAgoFromNow(policy.createdAt.toString())}`
            : ''
        }
        header={
          <div className="flex items-center justify-end gap-4">
            <Button
              size="sm"
              variant="destructive-outline"
              onClick={handleDeletePolicy}
            >
              Delete
            </Button>
            <Button
              name="Refresh instances"
              size="sm"
              variant="outline"
              onClick={handleRefreshPolicy}
            >
              <RotateCw size={16} className="text-muted-foreground" />
            </Button>
            <Link
              to={aimPaths.CREATE_NEW_POLICY}
              className={buttonVariants({
                size: 'sm',
                variant: 'secondary',
              })}
            >
              Create new policy
            </Link>
          </div>
        }
      >
        <div className="flex flex-col gap-8">
          {grids.map((step) => (
            <Card key={step.title}>
              <CardHeader variant="muted">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">{step.title}</h2>
                  {policy && (
                    <Link
                      to={`${aimPaths.UPDATE_POLICY}/${policy.alias}`}
                      className={cn(
                        buttonVariants({
                          size: 'sm',
                          variant: 'outline',
                        }),
                        'w-20',
                      )}
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ErrorBox error={readPolicyError} />
                {policy ? (
                  <KeyValueGrid
                    data={policy}
                    keys={step.keys}
                    colsCount={step.cols}
                  />
                ) : null}
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardHeader variant="muted">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">
                  Permissions in this policy
                </h2>
                {policy && (
                  <Link
                    to={`${aimPaths.UPDATE_POLICY}/${policy.alias}`}
                    className={cn(
                      buttonVariants({
                        size: 'sm',
                        variant: 'outline',
                      }),
                      'w-20',
                    )}
                  >
                    Edit
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={policyColumns}
                data={policy?.rules || []}
                expandedComponent={PolicyRuleActionDetails}
                noResultsComponent={<ErrorBox error={readPolicyError} />}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <DataTable
                title="Users attached to this policy"
                columns={userColumns}
                data={attachedUsers || []}
                header={AttachedUsersTableHeader(
                  handleDetachUsers,
                  handleRefreshAttachedUsers,
                )}
                noResultsComponent={<ErrorBox error={listAttachedUsersError} />}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <DataTable
                title="Attach users"
                columns={userColumns}
                data={listAttachedUsersError ? [] : (nonAttachedUsers ?? [])}
                header={NonAttachedUsersTableHeader(
                  handleAttachUsers,
                  handleRefreshAttachedUsers,
                )}
                noResultsComponent={<ErrorBox error={listAttachedUsersError} />}
              />
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </div>
  );
};

interface TableHeaderProps {
  table: Table<IManagedUser>;
}

const AttachedUsersTableHeader =
  (
    handleDetachUsers: (
      e: React.MouseEvent<HTMLButtonElement>,
      users: IManagedUser[],
    ) => void,
    handleRefreshAttachedUsers: (
      e: React.MouseEvent<HTMLButtonElement>,
    ) => void,
  ) =>
  ({ table: _ }: TableHeaderProps) => (
    <div className="flex items-center justify-end gap-4">
      <Button
        size="sm"
        variant="destructive-outline"
        onClick={(e) =>
          handleDetachUsers(
            e,
            _.getSelectedRowModel().rows.map((r) => r.original),
          )
        }
      >
        Detach
      </Button>
      <Button size="sm" variant="outline" onClick={handleRefreshAttachedUsers}>
        <RotateCw size={16} className="text-muted-foreground" />
      </Button>
    </div>
  );

const NonAttachedUsersTableHeader =
  (
    handleAttachUsers: (
      e: React.MouseEvent<HTMLButtonElement>,
      users: IManagedUser[],
    ) => void,
    handleRefreshAttachedUsers: (
      e: React.MouseEvent<HTMLButtonElement>,
    ) => void,
  ) =>
  ({ table }: TableHeaderProps) => (
    <div className="flex items-center justify-end gap-4">
      <Button
        size="sm"
        variant="outline"
        onClick={(e) =>
          handleAttachUsers(
            e,
            table.getSelectedRowModel().rows.map((r) => r.original),
          )
        }
      >
        Attach
      </Button>
      <Button size="sm" variant="outline" onClick={handleRefreshAttachedUsers}>
        <RotateCw size={16} className="text-muted-foreground" />
      </Button>
    </div>
  );

const grids = [
  {
    index: 0,
    title: 'Policy details',
    cols: 4,
    keys: [
      { key: 'alias', label: 'Alias' },
      {
        key: 'frn',
        label: 'Festify Resource Name (FRN)',
        formatter: (_: unknown, row: unknown) => {
          const { alias } = row as IPermissionPolicy;
          const value = generateFRN('aim', '', 'user', alias);
          return (
            <div className="flex items-center gap-2">
              <span>{readableFRN(value as string)}</span>
              <CopyIcon value={value as string} />
            </div>
          );
        },
      },
      {
        key: 'createdAt',
        label: 'Created at',
        formatter: (value: unknown) =>
          formatTimeAgoFromNow((value as Date).toString()),
      },
      {
        key: 'updatedAt',
        label: 'Updated at',
        formatter: (value: unknown) =>
          formatTimeAgoFromNow((value as Date).toString()),
      },
    ],
  },
];

const PolicyRuleActionDetails = ({
  row,
}: {
  row: Row<IPermissionPolicyRule>;
}) => (
  <div className="p-4 flex gap-2">
    <span className="font-semibold text-muted-foreground">Actions:</span>
    <span className="w-full">
      {row.original.actions
        .map((action: string) => action.split(':')[1])
        .join(', ')}
    </span>
  </div>
);

export default PermissionPolicyDetailsPage;
