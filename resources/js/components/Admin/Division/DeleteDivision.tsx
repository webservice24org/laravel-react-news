declare function route(
  name: string,
  params?: any
): string
import { router } from "@inertiajs/react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface Props {
  division: any
  onDeleted?: () => void
}

export default function DeleteDivision({ division, onDeleted }: Props) {
  const handleDelete = () => {
    router.delete(route("admin.divisions.destroy", division.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("Division deleted")
        onDeleted?.()
      },
      onError: () => {
        toast.error("Failed to delete division")
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Division</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{division.name}</strong>?
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white"
            onClick={handleDelete}
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
