import { formatTimeFromNow } from '@client/utils/time';
import { ColumnDef } from '@tanstack/react-table';
import ActionsCell from './cells/Actions';
import APIKeyCell from './cells/APIKey';

interface Instance {
  _id: string;
  status: string;
  apiKey: string;
  createdAt: string;
}

const commonColumns: ColumnDef<Instance>[] = [
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
    cell: APIKeyCell,
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
    cell: ActionsCell,
  },
];

const besColumns: ColumnDef<Instance>[] = [...commonColumns];

const columns = (type: string): ColumnDef<Instance>[] => {
  switch (type) {
    case 'bes':
      return besColumns;
    default:
      return commonColumns;
  }
};

export default columns;
