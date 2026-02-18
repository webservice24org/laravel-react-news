import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";

import CreateDistrict from "@/components/Admin/District/CreateDistrict";
import { EditDistrict } from "@/components/Admin/District/EditDistrict";
import { DeleteDistrict } from "@/components/Admin/District/DeleteDistrict";
import { BulkDeleteDistrict } from "@/components/Admin/District/BulkDeleteDistrict";
import DistrictStatusToggle from "@/components/Admin/District/DistrictStatusToggle";

import { DataTable } from "@/components/common/DataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Districts", href: "/admin/districts" },
];

export default function DistrictIndex({ districts, divisions }: { districts: any[], divisions: any[] }) {
  const [divisionFilter, setDivisionFilter] = useState<string | null>(null);

  // Filtered districts
  const filteredDistricts = divisionFilter
    ? districts.filter((d) => d.division?.id === Number(divisionFilter))
    : districts;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="District Management" />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold">Districts</h1>

          <div className="flex gap-2 flex-wrap items-center">
            {/* Division Filter */}
            <Select
              value={divisionFilter ?? "all"}
              onValueChange={(value) => setDivisionFilter(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Filter by Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {divisions.map((division) => (
                  <SelectItem key={division.id} value={String(division.id)}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateDistrict divisions={divisions} />
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          data={filteredDistricts}
          label="districts"
          searchKeys={["name", "division.name"]}
          selectable={true}
          bulkActionsSlot={(selectedIds, resetSelection) => (
            <BulkDeleteDistrict ids={selectedIds} onSuccess={resetSelection} />
          )}
          columns={[
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "District" },
            { accessorKey: "division.name", header: "Division" },
            {
              id: "status",
              header: "Status",
              cell: ({ row }) => <DistrictStatusToggle district={row.original} />,
            },
            { accessorKey: "order_no", header: "Order" },
          ]}
          actionsSlot={(district) => (
            <div className="flex gap-2">
              <EditDistrict district={district} divisions={divisions} />
              <DeleteDistrict district={district} />
            </div>
          )}
        />
      </div>
    </AppLayout>
  );
}
