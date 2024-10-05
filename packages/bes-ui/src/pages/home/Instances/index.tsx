import { DataTable } from '@sharedui/primitives/data-table';
import PageSection from '@sharedui/components/PageSection';
import { Card, CardContent } from '@sharedui/primitives/card';
import { columns } from '../../../components/instances/InstancesTable/columns';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Link } from 'react-router-dom';
import { besPaths } from '@sharedui/constants/paths';
import { BESInstanceType } from '@sharedtypes/bes';
import { RotateCw } from 'lucide-react';
import {
  useDeleteBESInstancesMutation,
  useGetBESInstancesQuery,
} from '../../../api/instances';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';

const Instances = () => {
  const { data: { instances = [] } = {}, refetch } = useGetBESInstancesQuery(
    {}
  );
  const [deleteInstances] = useDeleteBESInstancesMutation();

  const handleDelete = async (rows: BESInstanceType[]) => {
    try {
      await deleteInstances(rows.map((row) => row._id)).unwrap();
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
              header={({ table }) => (
                <div className="flex items-center justify-end gap-4">
                  <Button
                    size="sm"
                    variant="destructive-outline"
                    onClick={() =>
                      handleDelete(
                        table.getSelectedRowModel().rows.map((r) => r.original)
                      )
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
              )}
            />
          </CardContent>
        </Card>
      </PageSection>
    </div>
  );
};

export default Instances;
