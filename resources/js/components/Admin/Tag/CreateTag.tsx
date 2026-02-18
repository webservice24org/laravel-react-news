import { useState } from "react"
import { useForm } from "@inertiajs/react"
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

export default function CreateTag() {
  const [open, setOpen] = useState(false)

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    slug: "",
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    post(route("admin.tags.store"), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Tag created successfully")
        reset()
        setOpen(false)
      },
      onError: () => {
        toast.error("Failed to create tag")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Tag</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
          <DialogDescription className="sr-only">
            Use this form to create a new tag.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1">
            <label className="font-medium">Name</label>
            <Input
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Tag name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="font-medium">Slug</label>
            <Input
              value={data.slug}
              onChange={(e) => setData("slug", e.target.value)}
              placeholder="tag-slug (optional)"
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug}</p>
            )}
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
