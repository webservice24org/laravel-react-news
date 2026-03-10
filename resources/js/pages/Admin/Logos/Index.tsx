declare function route(name: string, params?: any): string

import AppLayout from "@/layouts/app-layout"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import toast from "react-hot-toast"
import { FormEvent } from "react"
import { BreadcrumbItem } from "@/types"

interface Logos {
  header?: string
  footer?: string
  login?: string
  dashboard?: string
  print?: string
  favicon?: string
}

interface PageProps {
  logos: Logos
}

export default function Index({ logos }: PageProps) {

  const { data, setData, post, processing } = useForm({
    header: null as File | null,
    footer: null as File | null,
    login: null as File | null,
    dashboard: null as File | null,
    print: null as File | null,
    favicon: null as File | null
  })

  const preview = (file: File | null, existing?: string) => {
    if (file) return URL.createObjectURL(file)
    if (existing) return `/storage/${existing}`
    return null
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()

    post(route("admin.logos.store"), {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Logos updated successfully")
      }
    })
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Logo Settings", href: "/admin/logos" },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>

      <div className="max-w-7xl p-10">

        <Card>
          <CardHeader>
            <CardTitle>Site Logos</CardTitle>
          </CardHeader>

          <CardContent>

            <form onSubmit={submit} className="space-y-8">

              {/* Header Logo */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Header Logo</label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setData("header", e.target.files?.[0] ?? null)
                  }
                />
                {preview(data.header, logos?.header) && (
                  <img
                    src={preview(data.header, logos?.header)!}
                    className="h-14 border rounded-md p-1"
                  />
                )}
              </div>

              {/* Footer Logo */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Footer Logo</label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setData("footer", e.target.files?.[0] ?? null)
                  }
                />
                {preview(data.footer, logos?.footer) && (
                  <img
                    src={preview(data.footer, logos?.footer)!}
                    className="h-14 border rounded-md p-1"
                  />
                )}
              </div>

              {/* Login Logo */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Login Logo</label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setData("login", e.target.files?.[0] ?? null)
                  }
                />
                {preview(data.login, logos?.login) && (
                  <img
                    src={preview(data.login, logos?.login)!}
                    className="h-14 border rounded-md p-1"
                  />
                )}
              </div>

              {/* Dashboard Logo */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Dashboard Logo</label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setData("dashboard", e.target.files?.[0] ?? null)
                  }
                />
                {preview(data.dashboard, logos?.dashboard) && (
                  <img
                    src={preview(data.dashboard, logos?.dashboard)!}
                    className="h-14 border rounded-md p-1"
                  />
                )}
              </div>

              {/* Print Logo */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Print Logo</label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setData("print", e.target.files?.[0] ?? null)
                  }
                />
                {preview(data.print, logos?.print) && (
                  <img
                    src={preview(data.print, logos?.print)!}
                    className="h-14 border rounded-md p-1"
                  />
                )}
              </div>

              {/* Favicon */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Favicon</label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setData("favicon", e.target.files?.[0] ?? null)
                  }
                />
                {preview(data.favicon, logos?.favicon) && (
                  <img
                    src={preview(data.favicon, logos?.favicon)!}
                    className="h-10 border rounded-md p-1"
                  />
                )}
              </div>

              <Button disabled={processing}>
                Save Logos
              </Button>

            </form>

          </CardContent>
        </Card>

      </div>

    </AppLayout>
  )
}