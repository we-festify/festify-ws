import {
  useGetPolicyByIdQuery,
  useDeletePoliciesMutation,
  useAttachUsersToPolicyMutation,
} from '@aim-ui/api/policies';
import { useGetManagedUsersQuery } from '@aim-ui/api/users';
import { columns as policyColumns } from '@aim-ui/components/policies/policy-rules-table-columns';
import { columns as userColumns } from '@aim-ui/components/users/users-table/columns';
import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { IPermissionPolicyRule } from '@sharedtypes/aim/permission-policy';
import CopyIcon from '@sharedui/components/copy-icon';
import KeyValueGrid from '@sharedui/components/key-value-grid';
import PageSection from '@sharedui/components/page-section';
import { aimPaths } from '@sharedui/constants/paths';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Card, CardContent, CardHeader } from '@sharedui/primitives/card';
import { DataTable } from '@sharedui/primitives/data-table';
import { getErrorMessage } from '@sharedui/utils/error';
import { readableFRN } from '@sharedui/utils/frn';
import { formatTimeFromNow } from '@sharedui/utils/time';
import { cn } from '@sharedui/utils/tw';
import { Row, Table } from '@tanstack/react-table';
import { RotateCw } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const PermissionPolicyDetailsPage = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const { data: { policy } = {}, refetch: refetchPolicy } =
    useGetPolicyByIdQuery(policyId as string);
  const navigate = useNavigate();
  const [deletePermissionPolicys] = useDeletePoliciesMutation();
  const { data: { users } = {} } = useGetManagedUsersQuery();
  const { data: { users: attachedUsers } = {}, refetch: refetchAttachedUsers } =
    useGetManagedUsersQuery({
      policy: policyId,
    });
  const nonAttachedUsers = users?.filter(
    (user) =>
      !attachedUsers?.find((attachedUser) => attachedUser._id === user._id),
  );
  const [attachUsersToPolicy] = useAttachUsersToPolicyMutation();

  const handleDeletePolicy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!policy) return;

    try {
      await deletePermissionPolicys([policy._id]).unwrap();
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
      await refetchPolicy();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleAttachUsers = async (
    e: React.MouseEvent<HTMLButtonElement>,
    userIds: string[],
  ) => {
    e.preventDefault();
    if (!policyId) return;
    try {
      await attachUsersToPolicy({ policyId, userIds }).unwrap();
      toast.success('Users attached successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRefreshAttachedUsers = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    try {
      await refetchAttachedUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (!policy) return null;

  return (
    <div className="p-8">
      <PageSection
        title={policy.alias}
        description={`Created ${formatTimeFromNow(policy.createdAt.toString())}`}
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
                      to={`${aimPaths.UPDATE_POLICY}/${policy._id}`}
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
                    to={`${aimPaths.UPDATE_POLICY}/${policy._id}`}
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
                data={policy.rules || []}
                expandedComponent={PolicyRuleActionDetails}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader variant="muted">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">
                  Users attached to this policy
                </h2>
                <div className="flex items-center justify-end gap-4">
                  <Button size="sm" variant="outline">
                    <RotateCw size={16} className="text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable columns={userColumns} data={attachedUsers || []} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <DataTable
                title="Attach users"
                columns={userColumns}
                data={nonAttachedUsers || []}
                header={NonAttachedUsersTableHeader(
                  handleAttachUsers,
                  handleRefreshAttachedUsers,
                )}
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

const NonAttachedUsersTableHeader =
  (
    handleAttachUsers: (
      e: React.MouseEvent<HTMLButtonElement>,
      userIds: string[],
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
            table.getSelectedRowModel().rows.map((r) => r.original._id),
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
        formatter: (value: unknown) => (
          <span className="flex items-center">
            {readableFRN(value as string)}
            <CopyIcon value={value as string} className="h-7 p-1 ml-2" />
          </span>
        ),
      },
      {
        key: 'createdAt',
        label: 'Created at',
        formatter: (value: unknown) =>
          formatTimeFromNow((value as Date).toString()),
      },
      {
        key: 'updatedAt',
        label: 'Updated at',
        formatter: (value: unknown) =>
          formatTimeFromNow((value as Date).toString()),
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
