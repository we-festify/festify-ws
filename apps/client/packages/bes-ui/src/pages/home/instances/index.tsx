import { DataTable } from '@sharedui/primitives/data-table';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { columns } from '../../../components/instances/instances-table/columns';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Link } from 'react-router-dom';
import { besPaths } from '@sharedui/constants/paths';
import { IBESInstance } from '@sharedtypes/bes';
import { RotateCw } from 'lucide-react';
import {
  useDeleteInstancesMutation,
  useListInstancesQuery,
} from '../../../api/instances';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { Table } from '@tanstack/react-table';
import { generateFRN } from '@sharedui/utils/frn';
import { useAuth } from '@rootui/providers/auth-provider';

const Instances = () => {
  const { user } = useAuth();
  const { data: { instances = [] } = {}, refetch } =
    useListInstancesQuery(undefined);
  const [deleteInstances] = useDeleteInstancesMutation();

  const handleDelete = async (rows: IBESInstance[]) => {
    try {
      const frns = rows.map((r) =>
        generateFRN('bes', user?.accountId ?? '', 'instance', r.alias),
      );
      await deleteInstances(frns).unwrap();
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
        title="Instances"
        description="Instances enables you to send emails through the Festify Basic Email Service. This page allows you to manage your instances. You can see the details of each instance by clicking on it."
      >
        <Card>
          <CardContent>
            <DataTable
              title="Instances"
              columns={columns}
              data={instances}
              header={TableHeader(handleDelete, handleRefetch)}
            />
          </CardContent>
        </Card>
      </PageSection>
    </div>
  );
};

interface TableHeaderProps {
  table: Table<IBESInstance>;
}

type DeleteFunction = (rows: IBESInstance[]) => void;
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
        name="Refresh instances"
        size="sm"
        variant="outline"
        onClick={handleRefetch}
      >
        <RotateCw size={16} className="text-muted-foreground" />
      </Button>
      <Link
        to={besPaths.CREATE_NEW_INSTANCE}
        className={buttonVariants({
          size: 'sm',
          variant: 'secondary',
        })}
      >
        Create intance
      </Link>
    </div>
  );

export default Instances;
