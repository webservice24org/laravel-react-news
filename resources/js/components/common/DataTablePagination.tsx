import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  label?: string // e.g. "divisions", "categories"
}

export function DataTablePagination<TData>({
  table,
  label = "items",
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination
  const total = table.getFilteredRowModel().rows.length

  if (!total) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Info */}
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium">
          {pageIndex * pageSize + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium">
          {Math.min((pageIndex + 1) * pageSize, total)}
        </span>{" "}
        of{" "}
        <span className="font-medium">{total}</span> {label}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          First
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>

        {Array.from({ length: table.getPageCount() })
          .slice(
            Math.max(0, pageIndex - 2),
            Math.min(table.getPageCount(), pageIndex + 3)
          )
          .map((_, i) => {
            const currentPage =
              i + Math.max(0, pageIndex - 2)

            return (
              <Button
                key={currentPage}
                size="sm"
                variant={
                  currentPage === pageIndex
                    ? "default"
                    : "outline"
                }
                onClick={() => table.setPageIndex(currentPage)}
              >
                {currentPage + 1}
              </Button>
            )
          })}

        <Button
          size="sm"
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            table.setPageIndex(table.getPageCount() - 1)
          }
          disabled={!table.getCanNextPage()}
        >
          Last
        </Button>
      </div>
    </div>
  )
}
