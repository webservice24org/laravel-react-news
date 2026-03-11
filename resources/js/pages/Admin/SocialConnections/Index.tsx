declare function route(name: string, params?: any): string

import AppLayout from "@/layouts/app-layout"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import toast from "react-hot-toast"
import { FormEvent } from "react"
import { BreadcrumbItem } from "@/types"

interface Social {
  facebook_url?: string
  twitter_url?: string
  pinterest_url?: string
  tiktok_url?: string
  instagram_url?: string
  youtube_url?: string
  whatsapp_url?: string
}

interface PageProps {
  social: Social | null
}

export default function Index({ social }: PageProps) {

  const { data, setData, post, processing } = useForm({
    facebook_url: social?.facebook_url || "",
    twitter_url: social?.twitter_url || "",
    pinterest_url: social?.pinterest_url || "",
    tiktok_url: social?.tiktok_url || "",
    instagram_url: social?.instagram_url || "",
    youtube_url: social?.youtube_url || "",
    whatsapp_url: social?.whatsapp_url || "",
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()

    post(route("admin.social-connections.store"), {
      onSuccess: () => {
        toast.success("Social connections saved successfully")
      }
    })
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Social Connections", href: "/admin/social-connections" }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>

      <div className="max-w-7xl p-10">

        <Card>
          <CardHeader>
            <CardTitle>Social Media Connections</CardTitle>
          </CardHeader>

          <CardContent>

            <form onSubmit={submit} className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-medium">Facebook URL</label>
                <Input
                  value={data.facebook_url}
                  onChange={(e)=>setData("facebook_url",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Twitter URL</label>
                <Input
                  value={data.twitter_url}
                  onChange={(e)=>setData("twitter_url",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pinterest URL</label>
                <Input
                  value={data.pinterest_url}
                  onChange={(e)=>setData("pinterest_url",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">TikTok URL</label>
                <Input
                  value={data.tiktok_url}
                  onChange={(e)=>setData("tiktok_url",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Instagram URL</label>
                <Input
                  value={data.instagram_url}
                  onChange={(e)=>setData("instagram_url",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">YouTube URL</label>
                <Input
                  value={data.youtube_url}
                  onChange={(e)=>setData("youtube_url",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp URL</label>
                <Input
                  value={data.whatsapp_url}
                  onChange={(e)=>setData("whatsapp_url",e.target.value)}
                />
              </div>

              <Button disabled={processing}>
                Save Social Links
              </Button>

            </form>

          </CardContent>
        </Card>

      </div>

    </AppLayout>
  )
}