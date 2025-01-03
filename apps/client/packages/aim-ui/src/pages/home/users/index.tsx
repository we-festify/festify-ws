import { IManagedUser } from '@sharedtypes/aim/managed-user';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { DataTable } from '@sharedui/primitives/data-table';
import { columns } from '@aim-ui/components/users/users-table/columns';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { aimPaths } from '@sharedui/constants/paths';
import { RotateCw } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import {
  useDeleteManagedUsersMutation,
  useListManagedUsersQuery,
} from '@aim-ui/api/users';
import { useAuth } from '@rootui/providers/auth-provider';
import { generateFRN } from '@sharedui/utils/frn';
import ErrorBox from '@sharedui/components/error-box';
import DeleteButton from '@sharedui/components/delete-button';

const ManagedUsersListPage = () => {
  const { user } = useAuth();
  const {
    data: { users: managedUsers } = {},
    refetch,
    error: listManagedUsersError,
  } = useListManagedUsersQuery(undefined);
  const [deleteUsers] = useDeleteManagedUsersMutation();

  const handleDelete = async (rows: IManagedUser[]) => {
    try {
      const frns = rows.map((row) =>
        generateFRN('aim', user?.accountId ?? '', 'user', row.alias),
      );
      await deleteUsers(frns).unwrap();
      toast.success('Users deleted successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleRefetch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await refetch().unwrap();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="p-8">
      <PageSection
        title="Users"
        description="An AIM user is an identity with long-term credentials that is used to interact with FWS in an account."
      >
        <Card>
          <CardContent>
            <DataTable
              title="Users"
              columns={columns}
              data={managedUsers || []}
              header={TableHeader(handleDelete, handleRefetch)}
              noResultsComponent={<ErrorBox error={listManagedUsersError} />}
            />
          </CardContent>
        </Card>
      </PageSection>
    </div>
  );
};

interface TableHeaderProps {
  table: Table<IManagedUser>;
}

type DeleteFunction = (rows: IManagedUser[]) => void;
type RefetchFunction = (e: React.MouseEvent<HTMLButtonElement>) => void;

const TableHeader =
  (handleDelete: DeleteFunction, handleRefetch: RefetchFunction) =>
  ({ table }: TableHeaderProps) => (
    <div className="flex items-center justify-end gap-4">
      <DeleteButton
        size="sm"
        variant="destructive-outline"
        onClick={() =>
          handleDelete(table.getSelectedRowModel().rows.map((r) => r.original))
        }
        description="This action cannot be undone. This will permanently delete the selected users."
      >
        Delete
      </DeleteButton>
      <Button
        name="Refresh users"
        size="sm"
        variant="outline"
        onClick={handleRefetch}
      >
        <RotateCw size={16} className="text-muted-foreground" />
      </Button>
      <Link
        to={aimPaths.CREATE_NEW_USER}
        className={buttonVariants({
          size: 'sm',
          variant: 'secondary',
        })}
      >
        Create user
      </Link>
    </div>
  );

export default ManagedUsersListPage;
