import { FormEvent, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";

import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
declare function route(name: string, params?: any): string

const breadcrumbs = [
    {
        title: "SEO Settings",
        href: route("admin.settings.seo"),
    },
];

interface SeoSettingsProps {
    seo: {
        site_name?: string;
        meta_title?: string;
        meta_description?: string;
        meta_keywords?: string;

        og_title?: string;
        og_description?: string;
        og_image?: string;

        twitter_title?: string;
        twitter_description?: string;
        twitter_image?: string;

        index_site?: boolean;
    } | null;
}

export default function SeoSettings({ seo }: SeoSettingsProps) {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            site_name: seo?.site_name ?? "",
            meta_title: seo?.meta_title ?? "",
            meta_description: seo?.meta_description ?? "",
            meta_keywords: seo?.meta_keywords ?? "",

            og_title: seo?.og_title ?? "",
            og_description: seo?.og_description ?? "",
            og_image: null as File | null,

            twitter_title: seo?.twitter_title ?? "",
            twitter_description: seo?.twitter_description ?? "",
            twitter_image: null as File | null,

            index_site: seo?.index_site ?? true,
        });

    useEffect(() => {
        if (recentlySuccessful) {
            toast.success("SEO settings updated successfully.");
        }
    }, [recentlySuccessful]);

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post(route("admin.settings.seo.store"), {
            forceFormData: true,

            onError: () => {
                toast.error("Please fix the validation errors.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="SEO Settings" />
            <div className="max-w-7xl p-10">
                <form
                    onSubmit={submit}
                    className="space-y-6 p-6"
                >
                    <div>
                        <h1 className="text-3xl font-bold">
                            SEO Settings
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Configure your website SEO, Open Graph and Twitter Card
                            information.
                        </p>
                    </div>

                    {/* General SEO */}

                    <div className="rounded-xl border bg-white p-6 shadow-sm">

                        <h2 className="mb-6 text-xl font-semibold">
                            General SEO
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block font-medium">
                                    Site Name
                                </label>

                                <input
                                    type="text"
                                    value={data.site_name}
                                    onChange={(e) =>
                                        setData("site_name", e.target.value)
                                    }
                                    className="w-full rounded-lg border p-3"
                                />

                                {errors.site_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.site_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block font-medium">
                                    Meta Title
                                </label>

                                <input
                                    type="text"
                                    value={data.meta_title}
                                    onChange={(e) =>
                                        setData("meta_title", e.target.value)
                                    }
                                    className="w-full rounded-lg border p-3"
                                />

                                {errors.meta_title && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.meta_title}
                                    </p>
                                )}
                            </div>

                        </div>

                        <div className="mt-6">

                            <label className="mb-2 block font-medium">
                                Meta Description
                            </label>

                            <textarea
                                rows={4}
                                value={data.meta_description}
                                onChange={(e) =>
                                    setData(
                                        "meta_description",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border p-3"
                            />

                        </div>

                        <div className="mt-6">

                            <label className="mb-2 block font-medium">
                                Meta Keywords
                            </label>

                            <textarea
                                rows={3}
                                value={data.meta_keywords}
                                onChange={(e) =>
                                    setData(
                                        "meta_keywords",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border p-3"
                            />

                        </div>

                        <div className="mt-6">

                            <label className="flex items-center gap-3">

                                <input
                                    type="checkbox"
                                    checked={data.index_site}
                                    onChange={(e) =>
                                        setData(
                                            "index_site",
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    Allow search engines to index this website
                                </span>

                            </label>

                        </div>

                    </div>

                    {/* Open Graph */}

                    <div className="rounded-xl border bg-white p-6 shadow-sm">

                        <h2 className="mb-6 text-xl font-semibold">
                            Open Graph (Facebook)
                        </h2>

                        <div className="space-y-5">

                            <input
                                type="text"
                                placeholder="OG Title"
                                value={data.og_title}
                                onChange={(e) =>
                                    setData("og_title", e.target.value)
                                }
                                className="w-full rounded-lg border p-3"
                            />

                            <textarea
                                rows={4}
                                placeholder="OG Description"
                                value={data.og_description}
                                onChange={(e) =>
                                    setData(
                                        "og_description",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border p-3"
                            />

                            {seo?.og_image && (
                                <img
                                    src={`/storage/${seo.og_image}`}
                                    className="h-32 rounded-lg border"
                                />
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        "og_image",
                                        e.target.files?.[0] ?? null
                                    )
                                }
                            />

                        </div>

                    </div>

                    {/* Twitter */}

                    <div className="rounded-xl border bg-white p-6 shadow-sm">

                        <h2 className="mb-6 text-xl font-semibold">
                            Twitter Card
                        </h2>

                        <div className="space-y-5">

                            <input
                                type="text"
                                placeholder="Twitter Title"
                                value={data.twitter_title}
                                onChange={(e) =>
                                    setData(
                                        "twitter_title",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border p-3"
                            />

                            <textarea
                                rows={4}
                                placeholder="Twitter Description"
                                value={data.twitter_description}
                                onChange={(e) =>
                                    setData(
                                        "twitter_description",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border p-3"
                            />

                            {seo?.twitter_image && (
                                <img
                                    src={`/storage/${seo.twitter_image}`}
                                    className="h-32 rounded-lg border"
                                />
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        "twitter_image",
                                        e.target.files?.[0] ?? null
                                    )
                                }
                            />

                        </div>

                    </div>

                    <div className="flex justify-end">

                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing
                                ? "Saving..."
                                : "Save SEO Settings"}
                        </Button>

                    </div>

                </form>
            </div>
        </AppLayout>
    );
}