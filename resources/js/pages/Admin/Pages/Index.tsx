declare function route(name: string, params?: any): string;

import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

interface Page {
  id: number;
  title: string;
  slug: string;
  content?: string;
  thumbnail?: string;
  status: boolean;
  layout: string;
}

interface Props {
  pages: {
    data: Page[];
    links: any[];
  };
}

export default function Index({ pages }: Props) {
  const [viewPage, setViewPage] = useState<Page | null>(null);

  const deletePage = (id: number) => {
    toast.loading("Deleting page...");
    router.delete(route("admin.pages.destroy", id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.dismiss();
        toast.success("Page deleted successfully");
      },
      onError: () => {
        toast.dismiss();
        toast.error("Delete failed");
      },
    });
  };

  const toggleStatus = (page: Page) => {
    router.patch(
      route("admin.pages.toggleStatus", page.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => toast.success("Status updated"),
        onError: () => toast.error("Failed to update status"),
      }
    );
  };

  return (
    <AppLayout>
      <div className="p-10">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Pages</h1>
          <Button onClick={() => router.visit(route("admin.pages.create"))}>
            Create Page
          </Button>
        </div>

        <div>
          <Table className="border border-border">
            <TableHeader>
              <TableRow className="border-2">
                <TableHead className="border-r">Title</TableHead>
                <TableHead className="border-r">Slug</TableHead>
                <TableHead className="border-r">Layout</TableHead>
                <TableHead className="border-r">Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pages.data.map((page) => (
                <TableRow key={page.id} className="border-2">
                  <TableCell className="border-r font-medium">{page.title}</TableCell>
                  <TableCell className="border-r">{page.slug}</TableCell>
                  <TableCell className="border-r">{page.layout}</TableCell>
                  <TableCell className="border-r">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={page.status}
                        onCheckedChange={() => toggleStatus(page)}
                      />
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          page.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {page.status ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewPage(page)}
                    >
                      View
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        router.visit(route("admin.pages.edit", page.id))
                      }
                    >
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Page</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the page.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePage(page.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-6 flex justify-end">
            {pages.links.map((link: any) => (
              <button
                key={link.url}
                dangerouslySetInnerHTML={{ __html: link.label }}
                disabled={!link.url}
                onClick={() => router.visit(link.url)}
                className="px-3 py-1 border rounded mx-1"
              />
            ))}
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Dialog open={!!viewPage} onOpenChange={() => setViewPage(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Page Details</DialogTitle>
          </DialogHeader>

          {viewPage && (
            <div className="space-y-4">
              <p>
                <strong>Title:</strong> {viewPage.title}
              </p>
              <p>
                <strong>Slug:</strong> {viewPage.slug}
              </p>
              <p>
                <strong>Layout:</strong> {viewPage.layout}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {viewPage.status ? "Enabled" : "Disabled"}
              </p>
              {viewPage.thumbnail && (
                <img
                  src={`/storage/${viewPage.thumbnail}`}
                  className="rounded border max-h-40 w-auto"
                />
              )}
              {viewPage.content && (
                <div>
                  <strong>Content</strong>
                  <pre className="bg-muted p-3 rounded mt-2 text-xs overflow-auto">
                    {viewPage.content}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}