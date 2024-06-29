import { ColumnDef } from '@tanstack/react-table';
import DataTable from './custom/DataTable';
import { formatTimeFromNow } from '../utils/time';
import InstancesTableActionsCell from './InstancesTableActionsCell';
import CopyIcon from './custom/CopyIcon';

interface Instance {
  _id: string;
  status: string;
  apiKey: string;
  createdAt: string;
}

interface InstancesTableProps {
  type: string;
  instances: Instance[];
}

const InstancesTable = ({ type, instances }: InstancesTableProps) => {
  instances = instances.map((instance) => ({
    ...instance,
    type,
  }));

  return <DataTable columns={columns} data={instances} />;
};

const columns: ColumnDef<Instance>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return row.getValue('status') === 'active' ? (
        <span className="text-blue-600">Active</span>
      ) : (
        <span className="text-orange-400 capitalize">
          {row.getValue('status')}
        </span>
      );
    },
  },
  {
    accessorKey: 'apiKey',
    header: 'API Key',
    cell: ({ row }: { row: any }) => {
      const apiKey = row.original.apiKey;

      return (
        <span className="text-muted-foreground flex items-center justify-between">
          <span>
            {apiKey.slice(0, 5)}
            **********
            {apiKey.slice(-4)}
          </span>
          <CopyIcon value={apiKey} />
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      return formatTimeFromNow(row.getValue('createdAt'));
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: InstancesTableActionsCell,
  },
];

export default InstancesTable;
