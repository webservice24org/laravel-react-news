declare function route(name: string, params?: any): string

import { useState, useMemo } from "react"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export function EditUnion({
  union,
  divisions,
  districts,
  upazilas,
}: {
  union: any
  divisions: any[]
  districts: any[]
  upazilas: any[]
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [selectedDivision, setSelectedDivision] = useState<string | null>(
    String(union.upazila.district.division_id)
  )
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
    String(union.upazila.district_id)
  )

  const [formData, setFormData] = useState({
    division_id: String(union.upazila.district.division_id),
    district_id: String(union.upazila.district_id),
    upazila_id: String(union.upazila_id),
    name: union.name,
    slug: union.slug,
    order_no: union.order_no,
    status: union.status ?? true, // <--- include status
    })


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

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    router.put(route("admin.unions.update", union.id), formData, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Union updated successfully")
        setOpen(false)
      },
      onFinish: () => setLoading(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Union</DialogTitle>
          <DialogDescription className="sr-only">
            Use this form to edit the union's division, district, and upazila.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 mt-2">
          {/* Division */}
          <div className="space-y-1">
            <label className="font-medium">Division</label>
            <Select
              value={formData.division_id || undefined}
              onValueChange={(value) => {
                setSelectedDivision(value || null)
                setSelectedDistrict(null)
                handleChange("division_id", value)
                handleChange("district_id", "")
                handleChange("upazila_id", "")
              }}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((division) => (
                  <SelectItem key={division.id} value={String(division.id)}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* District */}
          <div className="space-y-1">
            <label className="font-medium">District</label>
            <Select
              value={formData.district_id || undefined}
              onValueChange={(value) => {
                setSelectedDistrict(value || null)
                handleChange("district_id", value)
                handleChange("upazila_id", "")
              }}
              disabled={!selectedDivision || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {filteredDistricts.map((district) => (
                  <SelectItem key={district.id} value={String(district.id)}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upazila */}
          <div className="space-y-1">
            <label className="font-medium">Upazila</label>
            <Select
              value={formData.upazila_id || undefined}
              onValueChange={(value) => handleChange("upazila_id", value)}
              disabled={!selectedDistrict || loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Upazila" />
              </SelectTrigger>
              <SelectContent>
                {filteredUpazilas.map((upazila) => (
                  <SelectItem key={upazila.id} value={String(upazila.id)}>
                    {upazila.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Union Name */}
          <div className="space-y-1">
            <label className="font-medium">Union Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="font-medium">Slug</label>
            <Input
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Status */}
            <div className="space-y-1">
            <label className="font-medium">Status</label>
            <select
                value={formData.status ? "1" : "0"}
                onChange={(e) => handleChange("status", e.target.value === "1")}
                disabled={loading}
                className="w-full border rounded px-2 py-1"
            >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
            </select>
            </div>


          {/* Order */}
          <div className="space-y-1">
            <label className="font-medium">Order No</label>
            <Input
              type="number"
              value={formData.order_no}
              onChange={(e) => handleChange("order_no", Number(e.target.value))}
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
