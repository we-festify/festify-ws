import { DataTable } from '@sharedui/primitives/data-table';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Link } from 'react-router-dom';
import { RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { ColumnDef, Table } from '@tanstack/react-table';
import { generateFRN } from '@sharedui/utils/frn';
import { useAuth } from '@rootui/providers/auth-provider';
import ErrorBox from '@sharedui/components/error-box';
import DeleteButton from '@sharedui/components/delete-button';
import { Checkbox } from '@sharedui/primitives/checkbox';
import {
  useDeleteHandlersMutation,
  useListHandlersQuery,
} from '@methods-ui/api/handlers';
import { IMethodsHandler } from '@sharedtypes/methods';
import { methodsPaths } from '@sharedui/constants/paths';

export const Handlers = () => {
  const { user } = useAuth();
  const {
    data: { handlers = [] } = {},
    refetch,
    error,
  } = useListHandlersQuery();
  const [deleteHandlers] = useDeleteHandlersMutation();

  const handleDelete = async (rows: IMethodsHandler[]) => {
    try {
      const frns = rows.map((r) =>
        generateFRN('methods', user?.accountId ?? '', 'handler', r.alias),
      );
      await deleteHandlers(frns).unwrap();
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
        title="Handlers"
        description="Handlers are serverless functions that you can invoke to interact with your services."
      >
        <Card>
          <CardContent>
            <DataTable
              title="Handlers"
              columns={columns}
              data={handlers}
              header={TableHeader(handleDelete, handleRefetch)}
              noResultsComponent={<ErrorBox error={error} />}
            />
          </CardContent>
        </Card>
      </PageSection>
    </div>
  );
};

interface TableHeaderProps {
  table: Table<IMethodsHandler>;
}

type DeleteFunction = (rows: IMethodsHandler[]) => void;
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
        description="This action cannot be undone. This will permanently delete the selected handlers."
      >
        Delete
      </DeleteButton>
      <Button
        name="Refresh handlers"
        size="sm"
        variant="outline"
        onClick={handleRefetch}
      >
        <RotateCw size={16} className="text-muted-foreground" />
      </Button>
      <Link
        to={methodsPaths.CREATE_NEW_HANDLER}
        className={buttonVariants({
          size: 'sm',
          variant: 'secondary',
        })}
      >
        Create new handler
      </Link>
    </div>
  );

const columns: ColumnDef<IMethodsHandler>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mt-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mt-0.5"
      />
    ),
  },
  {
    header: 'Alias',
    accessorKey: 'alias',
    cell: ({ row }) => {
      const alias = row.original.alias;
      return (
        <Link
          to={methodsPaths.HANDLER_DETAILS(alias)}
          className="text-blue-600 hover:underline"
        >
          {alias}
        </Link>
      );
    },
  },
  {
    header: 'Runtime',
    accessorKey: 'runtime',
  },
  {
    header: 'Timeout (s)',
    accessorKey: 'timeoutInSeconds',
  },
  {
    header: 'Memory (MB)',
    accessorKey: 'memoryInMB',
  },
];
