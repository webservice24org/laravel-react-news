declare function route(name: string, params?: any): string;

import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { FormEvent } from "react";

interface Page {
  id: number;
  title: string;
  slug: string;
  content?: string;
  thumbnail?: string;
  status: boolean;
  layout: string;
}

interface PageFormData {
  title: string;
  slug: string;
  content?: string;
  thumbnail?: File | string | null;
  status: boolean;
  layout: string;
}

interface Props {
  page: Page;
}

export default function EditPage({ page }: Props) {
  const { data, setData, post, processing, errors } = useForm<PageFormData>({
    title: page.title,
    slug: page.slug,
    content: page.content || "",
    thumbnail: page.thumbnail || null,
    status: page.status,
    layout: page.layout,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("slug", data.slug);
    formData.append("content", data.content || "");
    formData.append("status", data.status ? "1" : "0");
    formData.append("layout", data.layout);

    if (data.thumbnail instanceof File) {
      formData.append("thumbnail", data.thumbnail);
    }

    post(route("admin.pages.update", page.id), {
      preserveScroll: true,
      onSuccess: () => toast.success("Page updated successfully"),
      onError: () => toast.error("Update failed"),
    });
  };

  return (
    <AppLayout>
      <div className="p-10 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Page</h1>

        <form onSubmit={submit} className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 md:col-span-9 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <Input
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                required
              />
              {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Slug</label>
              <Input
                value={data.slug}
                onChange={(e) => setData("slug", e.target.value)}
                required
              />
              {errors.slug && <p className="text-red-600 text-sm">{errors.slug}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Content</label>
              <Textarea
                value={data.content}
                onChange={(e) => setData("content", e.target.value)}
                rows={10}
              />
              {errors.content && <p className="text-red-600 text-sm">{errors.content}</p>}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-12 md:col-span-3 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Thumbnail</label>
              <Input
                type="file"
                onChange={(e) => setData("thumbnail", e.target.files?.[0] ?? null)}
              />
              {data.thumbnail && (
                <img
                  src={
                    typeof data.thumbnail === "string"
                      ? `/storage/${data.thumbnail}`
                      : URL.createObjectURL(data.thumbnail)
                  }
                  alt="Thumbnail Preview"
                  className="mt-2 max-h-40 rounded border w-full object-cover"
                />
              )}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <Switch
                checked={data.status}
                onCheckedChange={(val) => setData("status", val)}
              />
              <span>{data.status ? "Enabled" : "Disabled"}</span>
            </div>

            <div>
              <label className="block mb-1 font-medium">Layout</label>
              <Select
                value={data.layout}
                onValueChange={(val) => setData("layout", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (No Sidebar)</SelectItem>
                  <SelectItem value="sidebar-left">Sidebar Left</SelectItem>
                  <SelectItem value="sidebar-right">Sidebar Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-12 mt-4">
            <Button type="submit" disabled={processing}>
              Update Page
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}