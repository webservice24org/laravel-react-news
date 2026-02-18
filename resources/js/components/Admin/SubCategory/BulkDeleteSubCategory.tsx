declare function route(
  name: string,
  params?: any
): string
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Props {
  ids: number[];
  onSuccess?: () => void;
}

export function BulkDeleteSubCategory({ ids, onSuccess }: Props) {
  if (!ids.length) return null;

  const handleDelete = () => {
    router.post(
      route("admin.subcategories.bulk-delete"),
      { ids },
      {
        preserveScroll: true,
        onSuccess: () => {
          toast.success(`${ids.length} sub category(s) deleted successfully`);
          onSuccess?.();
        },
        onError: () => {
          toast.error("Bulk delete failed");
        },
      }
    );
  };

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
            You are about to delete <strong>{ids.length}</strong> sub categories.
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
