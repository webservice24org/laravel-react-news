"use client"

import { Head } from "@inertiajs/react"
import { useForm } from "@inertiajs/react"
import toast from "react-hot-toast"
import AppLayout from "@/layouts/app-layout"

import NewsTitles from "@/components/Admin/News/NewsTitles"
import NewsDescription from "@/components/Admin/News/NewsDescription"
import MetaSeoAccordion from "@/components/Admin/News/MetaSeoAccordion"

import PublishBox from "@/components/Admin/News/PublishBox"
import ThumbnailUpload from "@/components/Admin/News/ThumbnailUpload"
import TagSelector from "@/components/Admin/News/TagSelector"
import CategoryTreeWp from "@/components/Admin/News/CategoryTree"
import UserSelect from "@/components/Admin/News/UserSelector"
import LocationSelector from "@/components/Admin/News/LocationSelector"
import DeleteNewsButton from "@/components/Admin/News/DeleteNewsButton"

declare function route(name: string, params?: any): string

export default function EditNews({
  newsPost,
  categories = [],
  subcategories = [],
  tags = [],
  divisions = [],
  districts = [],
  upazilas = [],
  unions = [],
  users = [],
}: any) {
  const { data, setData, put, post, processing, errors } = useForm({
    top_title: newsPost.top_title ?? "",
    news_title: newsPost.news_title ?? "",
    hanger_title: newsPost.hanger_title ?? "",
    slug: newsPost.slug ?? "",
    news_description: newsPost.news_description ?? "",

    categories: newsPost.categories ?? [],
    subcategories: newsPost.subcategories ?? [],
    tags: newsPost.tags ?? [],
    new_tags: [] as string[],


    user_id: newsPost.user_id ?? "",

    divisions: newsPost.divisions ?? [],
    districts: newsPost.districts ?? [],
    upazilas: newsPost.upazilas ?? [],
    unions: newsPost.unions ?? [],
    primary_union_id: newsPost.primary_union_id ?? "",


    news_thumbnail: null, // 👈 only replace if new file selected
    thumbnail_caption: newsPost.thumbnail_caption ?? "",

    meta_title: newsPost.meta_title ?? "",
    meta_description: newsPost.meta_description ?? "",

    is_lead: Boolean(newsPost.is_lead),
    is_sub_lead: Boolean(newsPost.is_sub_lead),
    status: newsPost.status ?? "draft",
    scheduled_at: newsPost.scheduled_at ?? "",
  })

  const submit = (e: React.FormEvent) => {
  e.preventDefault()

  const formData = new FormData()
  formData.append("_method", "PUT") // ✅ IMPORTANT

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${key}[]`, String(v)))
    } else if (value instanceof File) {
      formData.append(key, value)
    } else if (typeof value === "boolean") {
      formData.append(key, value ? "1" : "0")
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value))
    }
  })

  post(route("admin.news-posts.update", newsPost.id), {
    forceFormData: true, // ✅ IMPORTANT
    preserveScroll: true,
    onSuccess: () => toast.success("News updated successfully!"),
    onError: () => toast.error("Failed to update news"),
  })
}


  return (
    <AppLayout>
      <Head title={`Edit: ${newsPost.news_title}`} />

      <form onSubmit={submit} className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Edit News</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-9 space-y-6">
            <Section title="Titles">
              <NewsTitles data={data} setData={setData} errors={errors} />
            </Section>

            <Section title="Content">
              <NewsDescription data={data} setData={setData} errors={errors} />
            </Section>

            <Section title="SEO">
              <MetaSeoAccordion data={data} setData={setData} errors={errors} />
            </Section>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-3 space-y-6">
            <SidebarBox title="Publish">
              <PublishBox data={data} setData={setData} />
              <button
                type="submit"
                disabled={processing}
                className="w-full mt-3 bg-blue-600 text-white rounded px-3 py-2"
              >
                {processing ? "Updating..." : "Update News"}
              </button>
              <DeleteNewsButton
              id={newsPost.id}
              title={newsPost.news_title}
            />

            </SidebarBox>

            <SidebarBox title="Location">
              <LocationSelector
                data={data}
                setData={setData}
                divisions={divisions}
                districts={districts}
                upazilas={upazilas}
                unions={unions}
                errors={errors}
              />
            </SidebarBox>

            <SidebarBox title="Categories">
              <CategoryTreeWp
                data={data}
                setData={setData}
                categories={categories}
                subcategories={subcategories}
                errors={errors}
              />
            </SidebarBox>

            <SidebarBox title="Tags">
              <TagSelector data={data} setData={setData} tags={tags} errors={errors} />
            </SidebarBox>

            <SidebarBox title="Featured Image">
              <ThumbnailUpload
                data={data}
                setData={setData}
                errors={errors}
                existingUrl={newsPost.news_thumbnail_url}   // ✅ add this
                />


            </SidebarBox>

            <SidebarBox title="Author">
              <UserSelect data={data} setData={setData} users={users} errors={errors} />
            </SidebarBox>
          </div>
        </div>
      </form>
    </AppLayout>
  )
}

/* ---------- small helpers ---------- */
function Section({ title, children }: any) {
  return (
    <div className="rounded border bg-white shadow-sm">
      <div className="border-b px-4 py-3 text-sm font-semibold">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function SidebarBox({ title, children }: any) {
  return (
    <div className="rounded border bg-white shadow-sm">
      <div className="border-b px-4 py-3 text-sm font-semibold">{title}</div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  )
}
