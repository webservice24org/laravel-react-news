import { useState } from "react"
import { router } from "@inertiajs/react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export function EditTag({ tag }: { tag: any }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: tag.name ?? "",
    slug: tag.slug ?? "",
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    router.put(route("admin.tags.update", tag.id), formData, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Tag updated successfully")
        setOpen(false)
      },
      onError: () => {
        toast.error("Failed to update tag")
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
          <DialogTitle>Edit Tag</DialogTitle>
          <DialogDescription className="sr-only">
            Use this form to update the tag name and slug.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1">
            <label className="font-medium">Name</label>
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
              placeholder="auto-generated if empty"
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
