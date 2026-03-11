declare function route(name: string, params?: any): string
import AppLayout from "@/layouts/app-layout"
import { useForm } from "@inertiajs/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { FormEvent } from "react"
import { BreadcrumbItem } from "@/types"

interface MailConfigProps {
  config?: {
    id?: number
    mailer?: string
    host?: string
    port?: number
    username?: string
    password?: string
    encryption?: string
    from_address?: string
    from_name?: string
  }
}

export default function MailConfigIndex({ config }: MailConfigProps) {
  const { data, setData, post, processing, reset } = useForm({
    mailer: config?.mailer || "smtp",
    host: config?.host || "",
    port: config?.port || 2525,
    username: config?.username || "",
    password: "",
    encryption: config?.encryption || "tls",
    from_address: config?.from_address || "",
    from_name: config?.from_name || "MicroWeb Technology",
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()

    post(route("admin.mail-config.store"), {
      onSuccess: () => {
        toast.success("Mail configuration saved successfully")
        // Clear cached mail config to apply immediately
        fetch(route("admin.mail-config.clear-cache"), { method: "POST" })
      },
      onError: (errors) => {
        toast.error("Failed to save configuration")
      },
    })
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Mail Configuration", href: "/admin/mail-config" },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl p-10 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mail Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-1">
                <label className="font-medium text-sm">Mailer</label>
                <Input
                  type="text"
                  value={data.mailer}
                  onChange={(e) => setData("mailer", e.target.value)}
                  placeholder="smtp"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-sm">Host</label>
                <Input
                  type="text"
                  value={data.host}
                  onChange={(e) => setData("host", e.target.value)}
                  placeholder="sandbox.smtp.mailtrap.io"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-sm">Port</label>
                <Input
                  type="number"
                  value={data.port}
                  onChange={(e) => setData("port", parseInt(e.target.value))}
                  placeholder="2525"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-sm">Username</label>
                <Input
                  type="text"
                  value={data.username}
                  onChange={(e) => setData("username", e.target.value)}
                  placeholder="example@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-sm">Password</label>
                <Input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="********"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-sm">Encryption</label>
                <Input
                  type="text"
                  value={data.encryption}
                  onChange={(e) => setData("encryption", e.target.value)}
                  placeholder="tls"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-sm">From Address</label>
                <Input
                  type="email"
                  value={data.from_address}
                  onChange={(e) => setData("from_address", e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-sm">From Name</label>
                <Input
                  type="text"
                  value={data.from_name}
                  onChange={(e) => setData("from_name", e.target.value)}
                  placeholder="MicroWeb Technology"
                />
              </div>

              <div className="md:col-span-2 mt-4">
                <Button type="submit" disabled={processing} className="w-full">
                  Save Configuration
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}