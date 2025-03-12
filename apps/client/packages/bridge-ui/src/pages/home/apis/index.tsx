import { DataTable } from '@sharedui/primitives/data-table';
import PageSection from '@sharedui/components/page-section';
import { Card, CardContent } from '@sharedui/primitives/card';
import { Button, buttonVariants } from '@sharedui/primitives/button';
import { Link } from 'react-router-dom';
import { bridgePaths } from '@sharedui/constants/paths';
import { RotateCw } from 'lucide-react';
import { useDeleteApisMutation, useListApisQuery } from '../../../api/apis';
import { toast } from 'sonner';
import { getErrorMessage } from '@sharedui/utils/error';
import { ColumnDef, Table } from '@tanstack/react-table';
import { generateFRN } from '@sharedui/utils/frn';
import { useAuth } from '@rootui/providers/auth-provider';
import ErrorBox from '@sharedui/components/error-box';
import DeleteButton from '@sharedui/components/delete-button';
import { IBridgeApi } from '@sharedtypes/bridge';
import { Checkbox } from '@sharedui/primitives/checkbox';

export const APIs = () => {
  const { user } = useAuth();
  const {
    data: { apis = [] } = {},
    refetch,
    error,
  } = useListApisQuery(undefined);
  const [deleteApis] = useDeleteApisMutation();

  const handleDelete = async (rows: IBridgeApi[]) => {
    try {
      const frns = rows.map((r) =>
        generateFRN('bridge', user?.accountId ?? '', 'api', r.alias),
      );
      await deleteApis(frns).unwrap();
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
        title="APIs"
        description="APIs are the collection of endpoints that you can invoke to interact with your services."
      >
        <Card>
          <CardContent>
            <DataTable
              title="APIs"
              columns={columns}
              data={apis}
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
  table: Table<IBridgeApi>;
}

type DeleteFunction = (rows: IBridgeApi[]) => void;
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
        description="This action cannot be undone. This will permanently delete the selected instances."
      >
        Delete
      </DeleteButton>
      <Button
        name="Refresh API list"
        size="sm"
        variant="outline"
        onClick={handleRefetch}
      >
        <RotateCw size={16} className="text-muted-foreground" />
      </Button>
      <Link
        to={bridgePaths.CREATE_NEW_API}
        className={buttonVariants({
          size: 'sm',
          variant: 'secondary',
        })}
      >
        Create new API
      </Link>
    </div>
  );

const columns: ColumnDef<IBridgeApi>[] = [
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
          to={bridgePaths.API_DETAILS(alias)}
          className="text-blue-600 hover:underline"
        >
          {alias}
        </Link>
      );
    },
  },
  {
    header: 'Deployment ID',
    accessorKey: 'uid',
  },
  {
    header: 'Invoke URL',
    accessorKey: 'invokeUrl',
    cell: ({ row }) => {
      const invokeUrl = row.original.invokeUrl;
      if (!invokeUrl) return null;
      return (
        <Link
          to={invokeUrl}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {invokeUrl}
        </Link>
      );
    },
  },
];
