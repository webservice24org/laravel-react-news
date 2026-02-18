declare function route(name: string, params?: any): string

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

interface CreateUpazilaProps {
  divisions: { id: number; name: string }[]
  districts: { id: number; name: string; division_id: number }[]
}

export default function CreateUpazila({ divisions, districts }: CreateUpazilaProps) {
  const [open, setOpen] = useState(false)
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null)

  const { data, setData, post, processing, errors, reset } = useForm({
    division_id: "",
    district_id: "",
    name: "",
    slug: "",
    order_no: "",
    status: true,
  })

  // Filter districts based on selected division
  const filteredDistricts = useMemo(() => {
    return selectedDivision
      ? districts.filter((d) => d.division_id === Number(selectedDivision))
      : []
  }, [selectedDivision, districts])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route("admin.upazilas.store"), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Upazila created successfully")
        reset()
        setOpen(false)
        setSelectedDivision(null)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Upazila</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Upazila</DialogTitle>
          <DialogDescription>
            Select a Division first, then choose a District. Fill in the Upazila details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 mt-2">
          {/* Division */}
          <div className="space-y-1">
            <label className="font-medium">Division</label>
            <Select
              value={selectedDivision ?? ""}
              onValueChange={(value) => {
                setSelectedDivision(value || null)
                setData("division_id", value)
                setData("district_id", "") // reset district when division changes
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
            {errors.division_id && (
              <p className="text-sm text-red-500">{errors.division_id}</p>
            )}
          </div>

          {/* District */}
          <div className="space-y-1">
            <label className="font-medium">District</label>
            <Select
              value={data.district_id}
              onValueChange={(value) => setData("district_id", value)}
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
            {errors.district_id && (
              <p className="text-sm text-red-500">{errors.district_id}</p>
            )}
          </div>

          {/* Upazila Name */}
          <div className="space-y-1">
            <label className="font-medium">Upazila Name</label>
            <Input
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Upazila name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="font-medium">Slug</label>
            <Input
              value={data.slug}
              onChange={(e) => setData("slug", e.target.value)}
              placeholder="upazila-slug"
            />
            {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
          </div>

          {/* Order No */}
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
