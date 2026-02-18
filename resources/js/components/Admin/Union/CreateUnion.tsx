import { useState, useMemo } from "react"
import { useForm } from "@inertiajs/react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

declare function route(name: string, params?: any): string

export default function CreateUnion({
  divisions,
  districts,
  upazilas,
}: {
  divisions: any[]
  districts: any[]
  upazilas: any[]
}) {
  const [open, setOpen] = useState(false)
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    division_id: "",
    district_id: "",
    upazila_id: "",
    name: "",
    slug: "",
    order_no: "",
    status: true,
  })

  // Filter districts by division
  const filteredDistricts = useMemo(() => {
    return selectedDivision
      ? districts.filter((d) => d.division_id === Number(selectedDivision))
      : []
  }, [selectedDivision, districts])

  // Filter upazilas by district
  const filteredUpazilas = useMemo(() => {
    return selectedDistrict
      ? upazilas.filter((u) => u.district_id === Number(selectedDistrict))
      : []
  }, [selectedDistrict, upazilas])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("admin.unions.store"), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Union created successfully")
        reset()
        setOpen(false)
        setSelectedDivision(null)
        setSelectedDistrict(null)
      },
      onError: () => {
        toast.error("Failed to create Union")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Union</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Union</DialogTitle>
          <DialogDescription className="sr-only">
            Use this form to create a new union under the selected division, district, and upazila.
            </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 mt-2">
          {/* Division */}
          <div className="space-y-1">
            <label className="font-medium">Division</label>
            <Select
              value={data.division_id || undefined}
              onValueChange={(value) => {
                setSelectedDivision(value || null)
                setSelectedDistrict(null)
                setData("division_id", value)
                setData("district_id", "")
                setData("upazila_id", "")
              }}
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
            {errors.division_id && <p className="text-sm text-red-500">{errors.division_id}</p>}
          </div>

          {/* District */}
          <div className="space-y-1">
            <label className="font-medium">District</label>
            <Select
              value={data.district_id || undefined}
              onValueChange={(value) => {
                setSelectedDistrict(value || null)
                setData("district_id", value)
                setData("upazila_id", "")
              }}
              disabled={!selectedDivision}
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
            {errors.district_id && <p className="text-sm text-red-500">{errors.district_id}</p>}
          </div>

          {/* Upazila */}
          <div className="space-y-1">
            <label className="font-medium">Upazila</label>
            <Select
              value={data.upazila_id || undefined}
              onValueChange={(value) => setData("upazila_id", value)}
              disabled={!selectedDistrict}
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
            {errors.upazila_id && <p className="text-sm text-red-500">{errors.upazila_id}</p>}
          </div>

          {/* Union Name */}
          <div className="space-y-1">
            <label className="font-medium">Union Name</label>
            <Input
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Union name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="font-medium">Slug</label>
            <Input
              value={data.slug}
              onChange={(e) => setData("slug", e.target.value)}
              placeholder="union-slug"
            />
            {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
          </div>

          {/* Order */}
          <div className="space-y-1">
            <label className="font-medium">Order No</label>
            <Input
              type="number"
              value={data.order_no}
              onChange={(e) => setData("order_no", e.target.value)}
              placeholder="Order"
            />
            {errors.order_no && <p className="text-sm text-red-500">{errors.order_no}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={processing}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
