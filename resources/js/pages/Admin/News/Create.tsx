declare function route(name: string, params?: any): string
import { useEffect, useMemo, useRef, useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { useForm } from "@inertiajs/react"
import toast from "react-hot-toast"
import AppLayout from "@/layouts/app-layout"

import NewsTitles from "@/components/Admin/News/NewsTitles"
import NewsDescription from "@/components/Admin/News/NewsDescription"
import MetaSeoAccordion from "@/components/Admin/News/MetaSeoAccordion"

import PublishBox from "@/components/Admin/News/PublishBox"
import ThumbnailUpload from "@/components/Admin/News/ThumbnailUpload"
import TagSelector from "@/components/Admin/News/TagSelector"

import CategoryTreeWp from "@/components/Admin/News/CategoryTree" // ✅ you will create/use this
import UserSelect from "@/components/Admin/News/UserSelector" // ✅ you will create/use this
import LocationSelector from "@/components/Admin/News/LocationSelector" // ✅ you will create/use this
import { ArrowLeft, FilePenLine } from "lucide-react";

declare function route(name: string, params?: any): string

function slugify(input: string) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-") // keep Bangla too
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
import { type BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "News Posts", href: "/admin/news-posts" },
];

export default function CreateNews({
  categories = [],
  subcategories = [],
  tags = [],
  divisions = [],
  districts = [],
  upazilas = [],
  unions = [],
  users = [],
}: any) {
  const { data, setData, post, processing, errors, reset } = useForm({
    top_title: "",
    news_title: "",
    hanger_title: "",
    slug: "",
    news_description: "",

    categories: [] as number[],
    subcategories: [] as number[],
    tags: [] as number[],
    new_tags: [] as string[],

    // ✅ author
    user_id: "",

    // ✅ location
    // ✅ location (multi)
    divisions: [] as number[],
    districts: [] as number[],
    upazilas: [] as number[],
    unions: [] as number[],

    // ✅ WP-like primary location
    primary_union_id: "",


    // ✅ thumb
    news_thumbnail: null as File | null,
    thumbnail_caption: "",

    // ✅ seo
    meta_title: "",
    meta_description: "",

    is_lead: false,
    is_sub_lead: false,
    status: "draft",
    scheduled_at: "",
    published_at: "",
  })

  /* ----------------------------------------------------
   ✅ Client-side blocking errors (no reload, keep form)
  ----------------------------------------------------- */
  const [clientErrors, setClientErrors] = useState<{ news_thumbnail?: string }>({})

  /* ----------------------------------------------------
   ✅ Auto-slug from title until user customizes slug
  ----------------------------------------------------- */
  const lastAutoSlugRef = useRef<string>("")
  const autoSlug = useMemo(() => slugify(data.news_title), [data.news_title])

  useEffect(() => {
    const current = (data.slug || "").trim()

    // if slug is empty OR equals previous auto slug -> keep syncing
    if (!current || current === lastAutoSlugRef.current) {
      setData("slug", autoSlug)
      lastAutoSlugRef.current = autoSlug
    }
    // else: user customized -> stop overwriting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSlug])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Block submit if thumbnail missing (required)
    const nextClientErrors: { news_thumbnail?: string } = {}

    if (!(data.news_thumbnail instanceof File)) {
      nextClientErrors.news_thumbnail = "Thumbnail is required."
    }

    if (Object.keys(nextClientErrors).length) {
      setClientErrors(nextClientErrors)
      toast.error("Please fix the errors before submitting.")
      return // ✅ stop submit; no page reload; form stays
    }

    setClientErrors({})

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, String(v)))
      } else if (value instanceof File) {
        formData.append(key, value)
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0")
      } else {
        formData.append(key, value ?? "")
      }
    })

    post(route("admin.news-posts.store"), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("News created successfully!")
        reset()
        setClientErrors({})
        lastAutoSlugRef.current = ""
      },
      onError: () => toast.error("Failed to create news"),
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create News" />
      {/* ================= Header ================= */}
      <div className="mb-8 flex flex-col gap-5 border m-2 border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:flex-row md:items-center md:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <FilePenLine className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit News Post
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Modify your article, manage media, SEO, categories and publishing settings.
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <Link href={route("admin.news-posts.index")}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              All Posts
            </Button>
          </Link>

        </div>

      </div>
      <form onSubmit={submit} className="p-4 md:p-6">
        {/* WP-like header row */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">Add New News</h1>

          {/* quick actions (optional) */}
          <div className="text-sm text-neutral-500 hidden md:block">
            Draft/Publish settings are on the right sidebar
          </div>
        </div>

        {/* 8/4 grid like WordPress */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT: 8 cols */}
          <div className="lg:col-span-9 space-y-6">
            <div className="rounded border bg-white shadow-sm dark:bg-gray-900">
              <div className="border-b px-4 py-3">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Titles</div>
              </div>
              <div className="p-4">
                <NewsTitles data={data} setData={setData} errors={errors} />
              </div>
            </div>

            <div className="rounded border bg-white shadow-sm dark:bg-gray-900">
              <div className="border-b px-4 py-3">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Content</div>
              </div>
              <div className="p-4">
                <NewsDescription data={data} setData={setData} errors={errors} />
              </div>
            </div>

            <div className="rounded border bg-white shadow-sm dark:bg-gray-900">
              <div className="border-b px-4 py-3">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">SEO</div>
              </div>
              <div className="p-4">
                <MetaSeoAccordion data={data} setData={setData} errors={errors} />
              </div>
            </div>
          </div>

          {/* RIGHT: 4 cols (sidebar) */}
          <div className="lg:col-span-3 space-y-6">
            {/* PublishBox + Actions (WP style) */}
            <div className="rounded border bg-white shadow-sm dark:bg-gray-900">
              <div className="border-b px-4 py-3">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Publish</div>
              </div>
              <div className="p-4 space-y-4">
                <PublishBox data={data} setData={setData} />

                {/* Actions (inside publish box) */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      reset()
                      setClientErrors({})
                      lastAutoSlugRef.current = ""
                    }}
                    className="px-3 py-2 border rounded hover:bg-gray-50 text-sm dark:hover:bg-gray-800 hover:cursor-pointer"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={processing}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm hover:cursor-pointer dark:hover:bg-blue-700"
                  >
                    {processing ? "Saving..." : "Create News"}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="rounded border bg-white shadow-sm dark:bg-gray-900">
                <div className="border-b px-4 py-3">
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">Publication Date</div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <label
                        htmlFor="published_at"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        Publication Date
                    </label>
                    <input
                      type="datetime-local"
                      id="published_at"
                      name="published_at"
                      value={data.published_at}
                      onChange={(e) => setData("published_at", e.target.value)}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                    {errors.published_at && (
                      <p className="text-sm text-red-600">{errors.published_at}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                        Leave empty to publish with the current date and time. Select a date to create a backdated article for the archive.
                    </p>
                  </div>
                </div>
            </div>
            {/* LocationSelector */}
            <div className="rounded border bg-white shadow-sm dark:bg-gray-900">
              <div className="border-b px-4 py-3">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Location</div>
              </div>
              <div className="p-4">
                <LocationSelector
                  data={data}
                  setData={setData}
                  divisions={divisions}
                  districts={districts}
                  upazilas={upazilas}
                  unions={unions}
                  errors={errors}
                />
              </div>
            </div>

            {/* CategoryTree */}
            <div className="rounded border bg-white shadow-sm dark:bg-gray-900">
              <div className="border-b px-4 py-3">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Categories</div>
              </div>
              <div className="p-4">
                <CategoryTreeWp
                  data={data}
                  setData={setData}
                  categories={categories}
                  subcategories={subcategories}
                  errors={errors}
                />
              </div>
            </div>

            {/* TagSelector */}
            <div className="rounded border bg-white shadow-sm dark:bg-gray-900">
              <div className="border-b px-4 py-3">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Tags</div>
              </div>
              <div className="p-4">
                <TagSelector data={data} setData={setData} tags={tags} errors={errors} />
              </div>
            </div>

            {/* ThumbnailUpload */}
            <div className="rounded border bg-white shadow-sm dark:bg-gray-900">
              <div className="border-b px-4 py-3">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Featured Image</div>
              </div>
              <div className="p-4 space-y-2">
                <ThumbnailUpload
                  data={data}
                  setData={(k: string, v: any) => {
                    setData(k, v)
                    if (k === "news_thumbnail") {
                      // clear required error as soon as a file is picked
                      setClientErrors((p) => ({ ...p, news_thumbnail: undefined }))
                    }
                  }}
                  errors={errors}
                />

                {/* ✅ Required error under the component (client-side) */}
                {clientErrors.news_thumbnail && (
                  <p className="text-sm text-red-600">{clientErrors.news_thumbnail}</p>
                )}
              </div>
            </div>

            {/* UserSelector */}
            <div className="rounded border bg-white shadow-sm dark:bg-gray-900">
              <div className="border-b px-4 py-3">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">Author</div>
              </div>
              <div className="p-4">
                <UserSelect data={data} setData={setData} users={users} errors={errors} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AppLayout>
  )
}
