import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDown as CaretSortIcon,
} from 'lucide-react';
import { Column } from '@tanstack/react-table';

import { cn } from '../../../lib/utils';
import { Button } from './button';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableSortableColumn<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent w-full justify-between"
        onClick={() => column.toggleSorting()}
      >
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <CaretSortIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
