import { ColumnDef } from '@tanstack/react-table';

import { IBESEmailTemplate } from '@sharedtypes/bes/email-template';
import { formatTimeAgoFromNow } from '@sharedui/utils/time';
import { Link } from 'react-router-dom';
import { besPaths } from '@sharedui/constants/paths';
import { Checkbox } from '@sharedui/primitives/checkbox';

export const columns: ColumnDef<IBESEmailTemplate>[] = [
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
    header: 'Template name',
    accessorKey: 'name',
    cell: ({ row }) => {
      const id = row.original._id;
      const name = row.original.name;
      return (
        <Link
          to={`${besPaths.EMAIL_TEMPLATE_DETAILS}/${id}`}
          className="text-blue-600 hover:underline"
        >
          {name}
        </Link>
      );
    },
  },
  {
    header: 'Email subject',
    accessorKey: 'subject',
  },
  {
    header: 'Created',
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return formatTimeAgoFromNow(date.toISOString());
    },
  },
];
