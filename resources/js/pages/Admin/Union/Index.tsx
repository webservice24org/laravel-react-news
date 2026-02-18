import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { useState, useMemo } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/common/DataTable"
import CreateUnion from "@/components/Admin/Union/CreateUnion"
import { BulkDeleteUnion } from "@/components/Admin/Union/BulkDeleteUnion"
import UnionStatusToggle from "@/components/Admin/Union/UnionStatusToggle"
import { EditUnion } from "@/components/Admin/Union/EditUnion"
import { DeleteUnion } from "@/components/Admin/Union/DeleteUnion"
import { Button } from "@/components/ui/button"

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Unions", href: "/admin/unions" },
]

export default function UnionIndex({
  unions = [],
  upazilas = [],
  districts = [],
  divisions = [],
}: {
  unions?: any[]
  upazilas?: any[]
  districts?: any[]
  divisions?: any[]
}) {
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [selectedUpazila, setSelectedUpazila] = useState<string | null>(null)

  // Filter districts based on selected division
  const filteredDistricts = useMemo(() => {
    return selectedDivision
      ? districts.filter((d) => d.division_id === Number(selectedDivision))
      : []
  }, [selectedDivision, districts])

  // Filter upazilas based on selected district
  const filteredUpazilas = useMemo(() => {
    return selectedDistrict
      ? upazilas.filter((u) => u.district_id === Number(selectedDistrict))
      : []
  }, [selectedDistrict, upazilas])

  // Filter unions based on selected upazila
  const filteredUnions = useMemo(() => {
    if (selectedUpazila) return unions.filter((u) => u.upazila_id === Number(selectedUpazila))
    if (selectedDistrict) return unions.filter((u) => u.upazila.district_id === Number(selectedDistrict))
    if (selectedDivision)
      return unions.filter((u) => u.upazila.district.division_id === Number(selectedDivision))
    return unions
  }, [selectedDivision, selectedDistrict, selectedUpazila, unions])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Union Management" />

      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl font-bold">Unions</h1>

          <div className="flex gap-2 flex-wrap items-center">
            {/* Division Filter */}
            <Select
                value={selectedDivision ?? undefined}
                onValueChange={(value) => {
                setSelectedDivision(value || null)
                setSelectedDistrict(null)
                setSelectedUpazila(null)
                }}
            >
                <SelectTrigger className="w-60">
                <SelectValue placeholder="Filter by Division" />
                </SelectTrigger>
                <SelectContent>
                {divisions.map((division) => (
                    <SelectItem key={division.id} value={String(division.id)}>
                    {division.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>

            {/* District Filter */}
            <Select
                value={selectedDistrict ?? undefined}
                onValueChange={(value) => {
                setSelectedDistrict(value || null)
                setSelectedUpazila(null)
                }}
                disabled={!selectedDivision}
            >
                <SelectTrigger className="w-60">
                <SelectValue placeholder="Filter by District" />
                </SelectTrigger>
                <SelectContent>
                {filteredDistricts.map((district) => (
                    <SelectItem key={district.id} value={String(district.id)}>
                    {district.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>

            {/* Upazila Filter */}
            <Select
                value={selectedUpazila ?? undefined}
                onValueChange={(value) => setSelectedUpazila(value || null)}
                disabled={!selectedDistrict}
            >
                <SelectTrigger className="w-60">
                <SelectValue placeholder="Filter by Upazila" />
                </SelectTrigger>
                <SelectContent>
                {filteredUpazilas.map((upazila) => (
                    <SelectItem key={upazila.id} value={String(upazila.id)}>
                    {upazila.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>

            {/* Reset Filters Button – only show if any filter is active */}
            {(selectedDivision || selectedDistrict || selectedUpazila) && (
                <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    setSelectedDivision(null)
                    setSelectedDistrict(null)
                    setSelectedUpazila(null)
                }}
                >
                Reset Filters
                </Button>
            )}

            {/* Create Union */}
            <CreateUnion divisions={divisions} districts={districts} upazilas={upazilas} />
            </div>


        </div>

        {/* DataTable */}
        <DataTable
          data={filteredUnions}
          label="unions"
          searchKeys={["name", "slug"]}
          selectable
          bulkActionsSlot={(selectedIds, resetSelection) => (
            <BulkDeleteUnion ids={selectedIds} onSuccess={resetSelection} />
          )}
          columns={[
            { accessorKey: "id", header: "ID" },
            { accessorKey: "name", header: "Union" },
            { accessorKey: "upazila.name", header: "Upazila" },
            { accessorKey: "upazila.district.name", header: "District" },
            {
              id: "status",
              header: "Status",
              cell: ({ row }) => <UnionStatusToggle union={row.original} />,
            },
            { accessorKey: "order_no", header: "Order" },
          ]}
          actionsSlot={(union) => (
            <div className="flex gap-2">
              <EditUnion union={union} divisions={divisions} districts={districts} upazilas={upazilas} />
              <DeleteUnion union={union} />
            </div>
          )}
        />
      </div>
    </AppLayout>
  )
}
