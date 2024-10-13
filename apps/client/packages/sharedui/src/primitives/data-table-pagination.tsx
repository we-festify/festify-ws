import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Table } from '@tanstack/react-table';

import { Button } from './button';
import { cn } from '../utils/tw';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const getPaginationRange = (span = 2) => {
    const range = [];
    const pageCount = table.getPageCount();
    const pageIndex = table.getState().pagination.pageIndex;

    const start = Math.max(0, pageIndex - span);
    const end = Math.min(pageCount - 1, pageIndex + span);

    for (let i = start; i <= end; i++) {
      if (i >= 0 && i < pageCount) {
        range.push(i);
      }
    }

    return range;
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        className="hidden h-8 w-8 p-0 lg:flex"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Go to first page</span>
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Go to previous page</span>
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      <div className="items-center justify-center gap-2 text-sm font-medium px-2 hidden lg:flex">
        {getPaginationRange(2).map((pageIndex) => (
          <Button
            key={pageIndex}
            variant="ghost"
            className={cn(
              'h-8 w-8 p-0',
              table.getState().pagination.pageIndex === pageIndex
                ? 'text-accent-foreground'
                : 'text-muted-foreground',
            )}
            onClick={() => table.setPageIndex(pageIndex)}
          >
            {pageIndex + 1}
          </Button>
        ))}
      </div>
      <div className="items-center justify-center gap-2 text-sm font-medium px-2 flex lg:hidden">
        {table.getState().pagination.pageIndex + 1}
      </div>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Go to next page</span>
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        className="hidden h-8 w-8 p-0 lg:flex"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Go to last page</span>
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
