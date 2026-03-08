"use client"

declare function route(name: string, params?: any): string;

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface Props {
  id: number;
  title: string;
  url?: string;
}

export default function MenuItem({ id, title, url }: Props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const deleteMenu = () => {
    router.delete(route("admin.menus.destroy", id), {
      preserveScroll: true,
      onSuccess: (page:any) => {

        toast.success("Menu item deleted successfully");

        if (page.props.menus) {
          window.dispatchEvent(
            new CustomEvent("menuUpdated", { detail: page.props.menus })
          );
        }

      },
      onError: () => {
        toast.error("Failed to delete menu item");
      }
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between border p-2 rounded bg-white"
    >

      <div
        className="flex items-center gap-3 cursor-move"
        {...attributes}
        {...listeners}
      >
        ☰
        <div>
          <div className="font-medium">{title}</div>
          {url && (
            <div className="text-xs text-gray-500">{url}</div>
          )}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
<button className="text-red-600 hover:text-red-700">
  <Trash2 size={16} />
</button>
</AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete menu item?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete this menu item.
              If it has children, they will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={deleteMenu}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}