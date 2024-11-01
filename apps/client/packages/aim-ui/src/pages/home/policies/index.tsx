import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { DataTable } from '@sharedui/primitives/data-table';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { aimPaths } from '@sharedui/constants/paths';
import { RotateCw } from 'lucide-react';
import { Table } from '@tanstack/react-table';
import {
  useDeletePoliciesMutation,
  useGetPoliciesQuery,
} from '@aim-ui/api/policies';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';
import { columns } from '@aim-ui/components/policies/policies-table/columns';

const PermissionPoliciesPage = () => {
  const { data: { policies } = {}, refetch } = useGetPoliciesQuery();
  const [deletePolicies] = useDeletePoliciesMutation();

  const handleDelete = async (rows: IPermissionPolicy[]) => {
    try {
      await deletePolicies(rows.map((row) => row._id)).unwrap();
      toast.success('Policies deleted successfully');
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
        title="Policies"
        description="A policy is an object in FWS that defines permissions."
      >
        <Card>
          <CardContent>
            <DataTable
              title="Policies"
              columns={columns}
              data={policies || []}
              header={TableHeader(handleDelete, handleRefetch)}
            />
          </CardContent>
        </Card>
      </PageSection>
    </div>
  );
};

interface TableHeaderProps {
  table: Table<IPermissionPolicy>;
}

type DeleteFunction = (rows: IPermissionPolicy[]) => void;
type RefetchFunction = (e: React.MouseEvent<HTMLButtonElement>) => void;

const TableHeader =
  (handleDelete: DeleteFunction, handleRefetch: RefetchFunction) =>
  ({ table }: TableHeaderProps) => (
    <div className="flex items-center justify-end gap-4">
      <Button
        size="sm"
        variant="destructive-outline"
        onClick={() =>
          handleDelete(table.getSelectedRowModel().rows.map((r) => r.original))
        }
      >
        Delete
      </Button>
      <Button
        name="Refresh policies"
        size="sm"
        variant="outline"
        onClick={handleRefetch}
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
        Create policy
      </Link>
    </div>
  );

export default PermissionPoliciesPage;
