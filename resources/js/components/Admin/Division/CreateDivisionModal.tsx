declare function route(
  name: string,
  params?: any
): string
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CreateDivisionModal() {
  const [open, setOpen] = useState(false)

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    slug: "",
    status: true,
    order_no: "",
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    post(route("admin.divisions.store"), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Division created successfully")
        reset()
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Division</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Division</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {/* Name */}
          <div>
            <Input
              placeholder="Division Name"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <Input
              placeholder="Slug"
              value={data.slug}
              onChange={(e) => setData("slug", e.target.value)}
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug}</p>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Status ({data.status ? "Active" : "Inactive"})
            </span>
            <Switch
              checked={data.status}
              onCheckedChange={(val) => setData("status", val)}
            />
          </div>

          {/* Order */}
          <Input
            type="number"
            placeholder="Order No"
            value={data.order_no}
            onChange={(e) => setData("order_no", e.target.value)}
          />

          <DialogFooter>
            <Button type="submit" disabled={processing}>
              {processing ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
