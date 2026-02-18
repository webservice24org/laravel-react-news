import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"

import CreateUpazila from "@/components/Admin/Upazila/CreateUpazila"
import { EditUpazila } from "@/components/Admin/Upazila/EditUpazila"
import { DeleteUpazila } from "@/components/Admin/Upazila/DeleteUpazila"
import { BulkDeleteUpazila } from "@/components/Admin/Upazila/BulkDeleteUpazila"
import UpazilaStatusToggle from "@/components/Admin/Upazila/UpazilaStatusToggle"

import { DataTable } from "@/components/common/DataTable"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { useState, useMemo } from "react"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Upazilas", href: "/admin/upazilas" },
]

export default function UpazilaIndex({
  upazilas,
  districts,
  divisions,
}: {
  upazilas: any[]
  districts: any[]
  divisions: any[]
}) {
  const [divisionFilter, setDivisionFilter] = useState<string | null>(null)
  const [districtFilter, setDistrictFilter] = useState<string | null>(null)

  // Filter districts by selected division
  const filteredDistricts = useMemo(() => {
    return divisionFilter
      ? districts.filter((d) => d.division_id === Number(divisionFilter))
      : districts
  }, [divisionFilter, districts])

  // Filter upazilas by selected district
  const filteredUpazilas = useMemo(() => {
    if (districtFilter) {
      return upazilas.filter((u) => u.district_id === Number(districtFilter))
    }
    if (divisionFilter) {
      // If no district selected but division is selected, show all upazilas under that division
      const districtIds = filteredDistricts.map((d) => d.id)
      return upazilas.filter((u) => districtIds.includes(u.district_id))
    }
    return upazilas
  }, [divisionFilter, districtFilter, upazilas, filteredDistricts])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Upazila Management" />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold">Upazilas</h1>

          <div className="flex gap-2 flex-wrap items-center">
            {/* Division Filter */}
            <Select
              value={divisionFilter ?? "all"}
              onValueChange={(value) => {
                setDivisionFilter(value === "all" ? null : value)
                setDistrictFilter(null) // reset district when division changes
              }}
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

            {/* District Filter */}
            <Select
              value={districtFilter ?? "all"}
              onValueChange={(value) =>
                setDistrictFilter(value === "all" ? null : value)
              }
              disabled={!filteredDistricts.length}
            >
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Filter by District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {filteredDistricts.map((district) => (
                  <SelectItem key={district.id} value={String(district.id)}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateUpazila divisions={divisions ?? []} districts={districts ?? []} />
          </div>
        </div>

        {/* DataTable */}
        <DataTable
          data={filteredUpazilas}
          label="upazilas"
          searchKeys={["name", "slug"]}
          selectable
          bulkActionsSlot={(selectedIds, resetSelection) => (
            <BulkDeleteUpazila
              ids={selectedIds}
              onSuccess={resetSelection}
            />
          )}
          columns={[
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Upazila" },
            { accessorKey: "district.name", header: "District" },
            { id: "status", header: "Status", cell: ({ row }) => <UpazilaStatusToggle upazila={row.original} /> },
            { accessorKey: "order_no", header: "Order" },
          ]}
          actionsSlot={(upazila) => (
            <div className="flex gap-2">
              <EditUpazila
                upazila={upazila}
                divisions={divisions}
                districts={districts}
              />
              <DeleteUpazila upazila={upazila} />
            </div>
          )}
        />
      </div>
    </AppLayout>
  )
}
