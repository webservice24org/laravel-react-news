declare function route(name: string, params?: any): string
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface DeleteUpazilaProps {
  upazila: any
  onDeleted?: () => void
}

export function DeleteUpazila({ upazila, onDeleted }: DeleteUpazilaProps) {
  const handleDelete = () => {
    router.delete(route("admin.upazilas.destroy", upazila.id), {
      onSuccess: () => {
        if (onDeleted) onDeleted()
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
          <DialogTitle>Delete Upazila</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete <strong>{upazila.name}</strong>? This
          action cannot be undone.
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
