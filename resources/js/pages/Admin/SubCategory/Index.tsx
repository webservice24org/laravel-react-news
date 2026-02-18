declare function route(
  name: string,
  params?: any
): string
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { DataTable } from "@/components/common/DataTable";
import CreateSubCategory from "@/components/Admin/SubCategory/CreateSubCategory";
import { EditSubCategory } from "@/components/Admin/SubCategory/EditSubCategory";
import { DeleteSubCategory } from "@/components/Admin/SubCategory/DeleteSubCategory";
import { BulkDeleteSubCategory } from "@/components/Admin/SubCategory/BulkDeleteSubCategory";
import SubCategoryStatusToggle from "@/components/Admin/SubCategory/SubCategoryStatusToggle";
import { type BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Sub Categories", href: "/admin/sub-categories" },
];

export default function SubCategoryIndex({
  subCategories,
  categories,
}: {
  subCategories: any[];
  categories: any[];
}) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sub Category Management" />

      <div className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold">Sub Categories</h1>

          <div className="flex gap-2 flex-wrap">
            <CreateSubCategory categories={categories} />
          </div>
        </div>

        <DataTable
          data={subCategories}
          label="sub categories"
          searchKeys={["name", "category.name"]}
          selectable={true}
          bulkActionsSlot={(selectedIds, resetSelection) => (
            <BulkDeleteSubCategory ids={selectedIds} onSuccess={resetSelection} />
          )}
          columns={[
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Sub Category" },
            { accessorKey: "category.name", header: "Category" },
            {
              id: "status",
              header: "Status",
              cell: ({ row }) => <SubCategoryStatusToggle subCategory={row.original} />,
            },
            { accessorKey: "order_no", header: "Order" },
          ]}
          actionsSlot={(subCategory) => (
            <div className="flex gap-2">
              <EditSubCategory subCategory={subCategory} categories={categories} />
              <DeleteSubCategory
                subCategory={subCategory}
                onDeleted={() => {}}
              />
            </div>
          )}
        />
      </div>
    </AppLayout>
  );
}
