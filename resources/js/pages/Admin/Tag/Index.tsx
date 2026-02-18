declare function route(
  name: string,
  params?: any
): string
import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"

import { DataTable } from "@/components/common/DataTable"
import CreateTag from "@/components/Admin/Tag/CreateTag"
import { BulkDeleteTag } from "@/components/Admin/Tag/BulkDeleteTag"
import { EditTag } from "@/components/Admin/Tag/EditTag"
import { DeleteTag } from "@/components/Admin/Tag/DeleteTag"


const breadcrumbs: BreadcrumbItem[] = [
  { title: "Tags", href: "/admin/tags" },
]

export default function TagIndex({
  tags = [],
}: {
  tags?: any[]
}) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tag Management" />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tags</h1>

          <CreateTag />
        </div>

        {/* DataTable */}
        <DataTable
          data={tags}
          label="tags"
          searchKeys={["name", "slug"]}
          selectable
          bulkActionsSlot={(selectedIds, resetSelection) => (
            <BulkDeleteTag ids={selectedIds} onSuccess={resetSelection} />
          )}
          columns={[
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Name" },
            { accessorKey: "slug", header: "Slug" },
          ]}
          actionsSlot={(tag) => (
            <div className="flex gap-2">
              <EditTag tag={tag} />
              <DeleteTag tag={tag} />
            </div>
          )}
        />
      </div>
    </AppLayout>
  )
}
