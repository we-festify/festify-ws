import * as React from 'react';
import { Input } from './input';

import {
  ColumnDef,
  ColumnFiltersState,
  Row,
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
import { SquareMinus, SquarePlus } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  description?: string;
  header?: (props: {
    table: ReturnType<typeof useReactTable<TData>>;
  }) => React.ReactNode;
  noResultsComponent?: React.ReactNode;
  expandedComponent?: (props: { row: Row<TData> }) => React.ReactNode;
  showActions?: boolean;
  isDataLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  header,
  noResultsComponent,
  expandedComponent,
  showActions = true,
  isDataLoading = false,
}: Readonly<DataTableProps<TData, TValue>>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [expandedRow, setExpandedRow] = React.useState<string | undefined>(
    undefined,
  );

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
              <h2 className="text-lg font-medium flex items-center gap-2">
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
          {header?.({ table })}
        </div>
      )}
      {showActions && (
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
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {expandedComponent && (
                  <TableHead className="w-3 bg-muted/50 dark:bg-muted-foreground/5" />
                )}
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-2 bg-muted/50 dark:bg-muted-foreground/5"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {expandedComponent && (
                      <TableCell className="py-0">
                        {expandedRow === row.id ? (
                          <SquareMinus
                            size={16}
                            onClick={() => setExpandedRow(undefined)}
                            className="text-secondary cursor-pointer"
                          />
                        ) : (
                          <SquarePlus
                            size={16}
                            onClick={() => setExpandedRow(row.id)}
                            className="text-muted-foreground cursor-pointer"
                          />
                        )}
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandedComponent && expandedRow === row.id && (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={columns.length + 1} className="p-0">
                        {expandedComponent({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (expandedComponent ? 1 : 0)}
                  className="min-h-24 text-center"
                >
                  {isDataLoading && (
                    <span className="text-muted-foreground">Loading...</span>
                  )}
                  {(!isDataLoading && noResultsComponent) || (
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
