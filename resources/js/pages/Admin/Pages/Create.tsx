declare function route(name: string, params?: any): string
import AppLayout from "@/layouts/app-layout";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { FormEvent } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PageContent from "@/components/Admin/Pages/PageContent";

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    slug: "",
    content: "",
    thumbnail: null as File | null,
    status: true,
    layout: "default",
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();

    post(route("admin.pages.store"), {
      forceFormData: true,
      onSuccess: () => toast.success("Page created successfully"),
    });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl p-10">

        <Card>
            <CardHeader>
                <h1 className="text-2xl font-bold mb-6">Create Page</h1>

            </CardHeader>
            <CardContent>   
                <form onSubmit={submit} className="grid grid-cols-12 gap-6">

                    {/* Left Side: Title, Slug, Content */}
                    <div className="col-span-12 md:col-span-9 space-y-6">

                        <div>
                        <label className="block mb-1 font-medium">Title</label>
                        <Input
                            value={data.title}
                            onChange={(e) => {
                                const title = e.target.value;

                                setData("title", title);

                                const slug = title
                                .toLowerCase()
                                .replace(/[^\w\s-]/g, "")
                                .replace(/\s+/g, "-");

                                setData("slug", slug);
                            }}
                            required
                            />
                        </div>

                        <div>
                        <label className="block mb-1 font-medium">Slug</label>
                        <Input
                            value={data.slug}
                            onChange={(e) => setData("slug", e.target.value)}
                            required
                        />
                        </div>

                        <div className="p-4">
                        <label className="block mb-1 font-medium">Content</label>

                          <PageContent data={data} setData={setData} errors={errors} />

                        </div>

                    </div>

                    {/* Right Side: Status, Thumbnail, Layout */}
                    <div className="col-span-12 md:col-span-3 space-y-6">

                        <div className="flex items-center gap-4">
                        <Switch
                            checked={data.status}
                            onCheckedChange={(val) => setData("status", val)}
                        />
                        <span>{data.status ? "Enabled" : "Disabled"}</span>
                        </div>

                        <div>
                        <label className="block mb-1 font-medium">Thumbnail</label>
                        <Input
                            type="file"
                            onChange={(e) => setData("thumbnail", e.target.files?.[0] ?? null)}
                        />
                        {data.thumbnail && (
                            <img
                            src={URL.createObjectURL(data.thumbnail)}
                            className="mt-2 max-h-40 rounded border"
                            />
                        )}
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

                        <Button type="submit" className="w-full" disabled={processing}>
                        Save Page
                        </Button>

                    </div>

                </form>
            </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}