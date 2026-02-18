import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { DataTable } from "@/components/common/DataTable";
import CreateCategory from "@/components/Admin/Category/CreateCategory";
import { EditCategory } from "@/components/Admin/Category/EditCategory";
import { DeleteCategory } from "@/components/Admin/Category/DeleteCategory";
import CategoryStatusToggle from "@/components/Admin/Category/CategoryStatusToggle";
import { BulkDeleteCategory } from "@/components/Admin/Category/BulkDeleteCategory";
import { type BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Categories", href: "/admin/categories" },
];

export default function CategoryIndex({ categories }: { categories: any[] }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Category Management" />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold">Category Management</h1>

          <div className="flex gap-2 flex-wrap">
            <CreateCategory />
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          data={categories}
          label="categories"
          searchKeys={["name", "slug"]}
          selectable={true}
          bulkActionsSlot={(selectedIds, resetSelection) => (
            <BulkDeleteCategory ids={selectedIds} onSuccess={resetSelection} />
          )}
          columns={[
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Name" },
            { accessorKey: "slug", header: "Slug" },
            {
              id: "status",
              header: "Status",
              cell: ({ row }) => <CategoryStatusToggle category={row.original} />,
            },
            { accessorKey: "order_no", header: "Order No" },
          ]}
          actionsSlot={(category) => (
            <div className="flex gap-2">
              <EditCategory category={category} />
              <DeleteCategory category={category} />
            </div>
          )}
        />
      </div>
    </AppLayout>
  );
}
