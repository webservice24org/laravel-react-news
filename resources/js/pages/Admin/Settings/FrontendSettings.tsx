"use client"

import { Head, useForm } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import toast from "react-hot-toast"
import { BreadcrumbItem } from "@/types"

declare function route(name: string, params?: any): string

interface Props {
  setting?: {
    sub_lead_title?: string
    latest_news_title?: string
    most_viewed_title?: string
    related_news_title?: string
    previous_news_text?: string
    next_news_text?: string
  }
}

export default function FrontendSettings({
  setting,
}: Props) {
  const { data, setData, post, processing, errors } = useForm({
    sub_lead_title: setting?.sub_lead_title ?? "Sub Lead News",
    latest_news_title: setting?.latest_news_title ?? "Latest News",
    most_viewed_title: setting?.most_viewed_title ?? "Most Viewed",
    related_news_title: setting?.related_news_title ?? "Related News",

    previous_news_text:
      setting?.previous_news_text ?? "Previous",

    next_news_text:
      setting?.next_news_text ?? "Next",
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    post(route("admin.frontend-settings.update"), {
      preserveScroll: true,

      onSuccess: () => {
        toast.success(
          "Frontend settings updated successfully!"
        )
      },

      onError: () => {
        toast.error(
          "Failed to update frontend settings."
        )
      },
    })
  }

  const breadcrumbs: BreadcrumbItem[] = [
      { title: "Website Settings", href: "/admin/frontend-settings" }
    ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Frontend Settings" />

      <div className="max-w-7xl p-10">
        <div className="rounded-xl border bg-white shadow-sm">

          <div className="border-b px-6 py-4">
            <h1 className="text-xl font-bold">
              Frontend Settings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage frontend section titles and labels.
            </p>
          </div>

          <form
            onSubmit={submit}
            className="space-y-6 p-6"
          >
            <InputField
              label="Sub Lead Title"
              value={data.sub_lead_title}
              error={errors.sub_lead_title}
              onChange={(v) =>
                setData("sub_lead_title", v)
              }
            />

            <InputField
              label="Latest News Title"
              value={data.latest_news_title}
              error={errors.latest_news_title}
              onChange={(v) =>
                setData("latest_news_title", v)
              }
            />

            <InputField
              label="Most Viewed Title"
              value={data.most_viewed_title}
              error={errors.most_viewed_title}
              onChange={(v) =>
                setData("most_viewed_title", v)
              }
            />

            <InputField
              label="Related News Title"
              value={data.related_news_title}
              error={errors.related_news_title}
              onChange={(v) =>
                setData("related_news_title", v)
              }
            />

            <InputField
              label="Previous Button Text"
              value={data.previous_news_text}
              error={errors.previous_news_text}
              onChange={(v) =>
                setData("previous_news_text", v)
              }
            />

            <InputField
              label="Next Button Text"
              value={data.next_news_text}
              error={errors.next_news_text}
              onChange={(v) =>
                setData("next_news_text", v)
              }
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={processing}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {processing
                  ? "Saving..."
                  : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}

function InputField({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border px-4 py-2.5 focus:border-blue-500 focus:outline-none"
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}