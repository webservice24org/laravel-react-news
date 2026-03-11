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

interface AnalyticsConfig {
  property_id?: string
  service_account_json?: string
}

interface PageProps {
  config: AnalyticsConfig | null
}

export default function Index({ config }: PageProps) {

  const { data, setData, post, processing } = useForm({
    property_id: config?.property_id || "",
    service_account_json: config?.service_account_json || "",
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()

    post(route("admin.analytics-config.store"), {
      onSuccess: () => {
        toast.success("Analytics configuration saved successfully")
      }
    })
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Analytics Configuration", href: "/admin/analytics-config" }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>

      <div className="max-w-7xl p-10">

        <Card>
          <CardHeader>
            <CardTitle>Google Analytics Configuration</CardTitle>
          </CardHeader>

          <CardContent>

            <form onSubmit={submit} className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-medium">Property ID</label>
                <Input
                  value={data.property_id}
                  onChange={(e)=>setData("property_id", e.target.value)}
                  placeholder="GA4 Property ID"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Service Account JSON
                </label>
                <Textarea
                  rows={10}
                  value={data.service_account_json}
                  onChange={(e)=>setData("service_account_json", e.target.value)}
                  placeholder="Paste Google Service Account JSON here"
                />
              </div>

              <Button disabled={processing}>
                Save Configuration
              </Button>

            </form>

          </CardContent>
        </Card>

      </div>

    </AppLayout>
  )
}