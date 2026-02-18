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
  ids: number[]
  onSuccess?: () => void
}

export function BulkDeleteDivision({ ids, onSuccess }: Props) {
  if (!ids.length) return null

  const handleDelete = () => {
    router.post(
      route("admin.divisions.bulk-delete"),
      { ids },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success(`${ids.length} division(s) deleted`)
          onSuccess?.()
        },
        onError: () => {
          toast.error("Bulk delete failed")
        },
      }
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          Delete Selected ({ids.length})
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete{" "}
            <strong>{ids.length}</strong> division(s).
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
