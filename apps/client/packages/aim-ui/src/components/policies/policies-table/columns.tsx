import { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@sharedui/primitives/checkbox';
import { aimPaths } from '@sharedui/constants/paths';
import { Link } from 'react-router-dom';
import { IPermissionPolicy } from '@sharedtypes/aim/permission-policy';

export const columns: ColumnDef<IPermissionPolicy>[] = [
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
          to={`${aimPaths.POLICY_DETAILS}/${alias}`}
          className="text-blue-600 hover:underline"
        >
          {alias}
        </Link>
      );
    },
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
];
