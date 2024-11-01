import { ColumnDef } from '@tanstack/react-table';

import { IPermissionPolicyRule } from '@sharedtypes/aim/permission-policy';
import { Checkbox } from '@sharedui/primitives/checkbox';
import { cn } from '@sharedui/utils/tw';

export const columns: ColumnDef<IPermissionPolicyRule>[] = [
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
    header: 'Service',
    cell: ({ row }) => {
      const serviceShort = row.original.actions[0].split(':')[0];
      return serviceShort;
    },
  },
  {
    header: 'Effect',
    accessorKey: 'effect',
    cell: ({ row }) => {
      const effect = row.original.effect;

      return (
        <span
          className={cn(
            'text-sm font-semibold',
            effect === 'allow' ? 'text-green-700' : 'text-destructive',
          )}
        >
          {effect === 'allow' ? 'Allow' : 'Deny'}
        </span>
      );
    },
  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    cell: ({ row }) => {
      const actions = row.original.actions;
      return actions.length;
    },
  },
  {
    header: 'Resources',
    accessorKey: 'resources',
    cell: ({ row }) => {
      const resources = row.original.resources;
      return resources.length === 0 ? 'All' : resources.length;
    },
  },
];
