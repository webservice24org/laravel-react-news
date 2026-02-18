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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export function EditUpazila({
  upazila,
  divisions,
  districts,
}: {
  upazila: any
  divisions: any[]
  districts: any[]
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Track selected division
  const initialDivision = districts.find(d => d.id === upazila.district_id)?.division_id
  const [selectedDivision, setSelectedDivision] = useState<string | null>(initialDivision ? String(initialDivision) : null)

  const [formData, setFormData] = useState({
    division_id: initialDivision ? String(initialDivision) : "",
    district_id: String(upazila.district_id),
    name: upazila.name,
    slug: upazila.slug,
    order_no: upazila.order_no,
  })

  // Filter districts based on selected division
  const filteredDistricts = useMemo(() => {
    return selectedDivision
      ? districts.filter(d => d.division_id === Number(selectedDivision))
      : districts
  }, [selectedDivision, districts])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    router.put(route("admin.upazilas.update", upazila.id), formData, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Upazila updated successfully")
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
          <DialogTitle>Edit Upazila</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 mt-2">
          {/* Division */}
          <div className="space-y-1">
            <label className="font-medium">Division</label>
            <Select
              value={formData.division_id}
              onValueChange={(value) => {
                setSelectedDivision(value)
                handleChange("division_id", value)
                handleChange("district_id", "") // reset district when division changes
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
              value={formData.district_id}
              onValueChange={(value) => handleChange("district_id", value)}
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

          {/* Name */}
          <div className="space-y-1">
            <label className="font-medium">Upazila Name</label>
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
