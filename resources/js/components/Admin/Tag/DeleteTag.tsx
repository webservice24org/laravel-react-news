import { router } from "@inertiajs/react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
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

export function DeleteTag({ tag }: { tag: any }) {
  const destroy = () => {
    router.delete(route("admin.tags.destroy", tag.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Tag deleted successfully")
      },
      onError: () => {
        toast.error("Failed to delete tag")
      },
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tag</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{tag.name}</span>?  
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={destroy}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
