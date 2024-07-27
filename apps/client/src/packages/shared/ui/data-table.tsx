import * as React from 'react';
import { Input } from './input';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  description?: string;
  header?: (props: {
    table: ReturnType<typeof useReactTable<TData>>;
  }) => React.ReactNode;
  noResultsComponent?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  header,
  noResultsComponent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div>
      {(title || header) && (
        <div className="flex items-start justify-between pb-4">
          <div className="flex flex-col gap-2 pl-0.5">
            {title && (
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {title}
                <span className="text-base font-normal text-muted-foreground">
                  {' '}
                  ({table.getRowCount()})
                </span>
              </h2>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {header && header({ table })}
        </div>
      )}
      <div className="flex items-center gap-4 pb-4">
        <Input
          type="text"
          placeholder="Search by field:value"
          onChange={(e) => {
            const keyValues = e.target.value.split(' ');
            const filters = keyValues.map((keyValue) => {
              const [key, value] = keyValue.split(':');
              return { key, value };
            });
            filters.forEach(({ key, value }) => {
              if (!key || !value) return table.setColumnFilters([]);
              console.log({ key, value });
              table.getColumn(key)?.setFilterValue(value || '');
            });
          }}
          className="max-w-sm h-8"
        />
        <div className="flex items-center space-x-4 ml-auto">
          <DataTablePagination table={table} />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="py-2 bg-muted/50 dark:bg-muted-foreground/5"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="min-h-24 text-center"
                >
                  {noResultsComponent || (
                    <span className="text-muted-foreground">
                      No results found
                    </span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
