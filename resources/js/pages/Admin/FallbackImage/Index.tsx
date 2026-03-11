declare function route(name: string, params?: any): string;

import { FormEvent, useState } from "react";
import { useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { BreadcrumbItem } from "@/types";

interface Fallback {
  path?: string;
}

interface PageProps {
  fallback?: Fallback;
}

export default function FallbackImageIndex({ fallback }: PageProps) {
  const { data, setData, post, processing } = useForm({
    image: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(fallback?.path ? `/storage/${fallback.path}` : null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setData("image", file);
    setPreviewUrl(file ? URL.createObjectURL(file) : fallback?.path ? `/storage/${fallback.path}` : null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post(route("admin.fallback-image.store"), {
      forceFormData: true,
      onSuccess: () => toast.success("Fallback image updated successfully"),
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Fallback Image", href: route("admin.fallback-image.index") },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-3xl p-10">
        <Card>
          <CardHeader>
            <CardTitle>News Thumbnail Fallback Image</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-medium">Image</label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Fallback Preview"
                    className="h-40 w-auto border rounded-md p-1 mt-2"
                  />
                )}
              </div>

              <Button type="submit" disabled={processing} className="w-full">
                Save Fallback Image
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}