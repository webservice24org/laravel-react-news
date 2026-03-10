declare function route(name: string, params?: any): string

import AppLayout from "@/layouts/app-layout"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import toast from "react-hot-toast"
import { FormEvent } from "react"
import { BreadcrumbItem } from "@/types"

interface Setting {
  website_name?: string
  tagline?: string
  meta_tags?: string
  meta_description?: string
  copyright_credit?: string
}

interface PageProps {
  setting: Setting | null
}

export default function Index({ setting }: PageProps) {

  const { data, setData, post, processing } = useForm({
    website_name: setting?.website_name || "",
    tagline: setting?.tagline || "",
    meta_tags: setting?.meta_tags || "",
    meta_description: setting?.meta_description || "",
    copyright_credit: setting?.copyright_credit || "",
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()

    post(route("admin.settings.store"), {
      onSuccess: () => {
        toast.success("Settings saved successfully")
      }
    })
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Website Settings", href: "/admin/settings" }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>

      <div className="max-w-7xl p-10">

        <Card>
          <CardHeader>
            <CardTitle>Website Settings</CardTitle>
          </CardHeader>

          <CardContent>

            <form onSubmit={submit} className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-medium">Website Name</label>
                <Input
                  value={data.website_name}
                  onChange={(e)=>setData("website_name",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tagline</label>
                <Input
                  value={data.tagline}
                  onChange={(e)=>setData("tagline",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Tags</label>
                <Textarea
                  value={data.meta_tags}
                  onChange={(e)=>setData("meta_tags",e.target.value)}
                  placeholder="news, bangladesh news, world news"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Meta Description</label>
                <Textarea
                  value={data.meta_description}
                  onChange={(e)=>setData("meta_description",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Copyright Credit</label>
                <Input
                  value={data.copyright_credit}
                  onChange={(e)=>setData("copyright_credit",e.target.value)}
                />
              </div>

              <Button disabled={processing}>
                Save Settings
              </Button>

            </form>

          </CardContent>
        </Card>

      </div>

    </AppLayout>
  )
}