import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout";
import { DataTable } from "@/components/common/DataTable"
import CreateDivisionModal from "@/components/Admin/Division/CreateDivisionModal"
import EditDivisionModal from "@/components/Admin/Division/EditDivisionModal"
import DeleteDivision from "@/components/Admin/Division/DeleteDivision"
import { BulkDeleteDivision } from "@/components/Admin/Division/BulkDeleteDivision"
import DivisionStatusToggle from "@/components/Admin/Division/DivisionStatusToggle"
import { type BreadcrumbItem } from "@/types"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Divisions", href: "/admin/divisions" },
]

export default function DivisionIndex({ divisions }: { divisions: any[] }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Division Management" />

      <div className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold">Divisions</h1>
          <div className="flex gap-2 flex-wrap">
            <CreateDivisionModal />
          </div>
        </div>

        <DataTable
            data={divisions}
            label="divisions"
            searchKeys={["name", "slug"]}
            selectable={true}
            bulkActionsSlot={(selectedIds, resetSelection) => (
                <BulkDeleteDivision ids={selectedIds} onSuccess={resetSelection} />
            )}
            columns={[
                { accessorKey: "id", header: "ID" },
                { accessorKey: "name", header: "Division" },
                { accessorKey: "slug", header: "Slug" },
                {
                id: "status",
                header: "Status",
                cell: ({ row }) => <DivisionStatusToggle division={row.original} />,
                },
                { accessorKey: "order_no", header: "Order" },
            ]}
            actionsSlot={(division) => (
                <div className="flex gap-2">
                <EditDivisionModal division={division} />
                <DeleteDivision division={division} />
                </div>
            )}
            />
            

      </div>
    </AppLayout>
  )
}
