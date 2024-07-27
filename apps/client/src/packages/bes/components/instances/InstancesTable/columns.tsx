import { ColumnDef } from '@tanstack/react-table';

import {
  BESInstanceStatusType,
  BESInstanceType,
} from '@shared/types/bes/instance';
import {
  instanceStatusIcons,
  instanceStatusMapping,
} from '../../../constants/instance';
import { Link } from 'react-router-dom';
import { paths } from '../../../constants/paths';
import { Checkbox } from '../../../../shared/ui/checkbox';

export const columns: ColumnDef<BESInstanceType>[] = [
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
          to={`${paths.INSTANCE_DETAILS}${alias}`}
          className="text-blue-600 hover:underline"
        >
          {alias}
        </Link>
      );
    },
  },
  {
    header: 'Sender email',
    accessorKey: 'senderEmail',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex gap-2 items-center">
          {instanceStatusIcons[status as BESInstanceStatusType]}
          <span>{instanceStatusMapping[status as BESInstanceStatusType]}</span>
        </div>
      );
    },
  },
];
