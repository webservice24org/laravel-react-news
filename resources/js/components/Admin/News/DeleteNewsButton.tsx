"use client"

import { router } from "@inertiajs/react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"


declare function route(name: string, params?: any): string

export default function DeleteNewsButton({
  id,
  title,
}: {
  id: number
  title?: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="gap-1"
        >
          <Trash2 className="h-4 w-4 text-white" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this news post?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete{" "}
            <span className="font-medium text-red-600">
              {title ?? "this post"}
            </span>.
            <br />
            <br />
            This action will:
            <ul className="list-disc ml-5 mt-2 text-sm">
              <li>Remove the post permanently</li>
              <li>Delete the featured image</li>
              <li>Remove all category, tag & location relations</li>
            </ul>
            <br />
            <strong>This action cannot be undone.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              router.delete(route("admin.news-posts.destroy", id), {
                preserveScroll: true,
                
              })
            }}
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
