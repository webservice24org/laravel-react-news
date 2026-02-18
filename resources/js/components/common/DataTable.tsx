import { useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "./DataTablePagination";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  label: string;
  searchKeys?: (keyof T)[];
  selectable?: boolean;
  bulkActionsSlot?: (selectedIds: number[], resetSelection: () => void) => JSX.Element;
  actionsSlot?: (row: T) => JSX.Element;
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  label,
  searchKeys = [],
  selectable = false,
  bulkActionsSlot,
  actionsSlot,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Add select column if selectable
  let finalColumns: ColumnDef<T>[] = selectable
    ? [
        {
          id: "select",
          header: ({ table }) => (
            <input
              type="checkbox"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              className="h-4 w-4"
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
              className="h-4 w-4"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        ...columns,
      ]
    : [...columns];

  // Add "Actions" column if actionsSlot is provided
  if (actionsSlot) {
    finalColumns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => actionsSlot(row.original),
      enableSorting: false,
      enableHiding: false,
    });
  }

  const table = useReactTable<T>({
    data,
    columns: finalColumns,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
  const resetSelection = () => table.resetRowSelection();

  const handleSearch = (value: string) => {
    setSearch(value);
    searchKeys.forEach((key) => table.getColumn(key as string)?.setFilterValue(value));
  };

  return (
    <div className="space-y-2">
      {/* Search + Bulk Actions Row */}
      {(searchKeys.length > 0 || (bulkActionsSlot && selectedIds.length > 0)) && (
        <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
          {/* Search Input */}
          {searchKeys.length > 0 && (
            <Input
              placeholder={`Search ${label}...`}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64"
            />
          )}

          {/* Bulk Actions (Right aligned) */}
          {bulkActionsSlot && selectedIds.length > 0 && bulkActionsSlot(selectedIds, resetSelection)}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="border-r last:border-0">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border-r last:border-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={finalColumns.length} className="text-center h-24">
                  No {label} found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} label={label} />
    </div>
  );
}
