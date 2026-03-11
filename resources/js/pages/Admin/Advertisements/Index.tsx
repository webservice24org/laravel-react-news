declare function route(name: string, params?: any): string

import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow
} from "@/components/ui/table"

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle
} from "@/components/ui/dialog"

import { useState } from "react"
import { router } from "@inertiajs/react"
import toast from "react-hot-toast"

interface Ad {
  id:number
  ad_name:string
  ad_url?:string
  ad_image?:string
  ad_code?:string
  is_global:boolean
  status:boolean
  categories:{id:number,name:string}[]
  sub_categories:{id:number,name:string}[]
}

export default function Index({ ads }: { ads:Ad[] }) {

  const [viewAd,setViewAd] = useState<Ad | null>(null)

  const deleteAd = (id:number)=>{

    if(!confirm("Delete this advertisement?")) return

    router.delete(route("admin.advertisements.destroy",id),{
      onSuccess:()=>toast.success("Advertisement deleted")
    })

  }

  return (
    <AppLayout>

      <div className="p-10">

        <div className="flex justify-between mb-6">

          <h1 className="text-2xl font-bold">
            Advertisements
          </h1>

          <Button
          onClick={()=>router.visit(route("admin.advertisements.create"))}
          >
            Create Ad
          </Button>

        </div>

        <div className="border rounded-lg">

          <Table>

            <TableHeader>
              <TableRow>

                <TableHead>Ad Name</TableHead>
                <TableHead>Category / SubCategory</TableHead>
                <TableHead>Global</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>

              {ads.map((ad)=>(
                <TableRow key={ad.id}>

                  <TableCell className="font-medium">
                    {ad.ad_name}
                  </TableCell>

                  <TableCell>

                    <div className="flex flex-wrap gap-1">

                      {ad.categories.map(c=>(
                        <span
                        key={c.id}
                        className="px-2 py-1 text-xs bg-blue-100 rounded"
                        >
                          {c.name}
                        </span>
                      ))}

                      {ad.sub_categories.map(sc=>(
                        <span
                        key={sc.id}
                        className="px-2 py-1 text-xs bg-green-100 rounded"
                        >
                          {sc.name}
                        </span>
                      ))}

                    </div>

                  </TableCell>

                  <TableCell>
                    {ad.is_global ? "Yes" : "No"}
                  </TableCell>

                  <TableCell>
                    {ad.status ? "Enabled" : "Disabled"}
                  </TableCell>

                  <TableCell className="flex gap-2">

                    <Button
                    variant="outline"
                    size="sm"
                    onClick={()=>setViewAd(ad)}
                    >
                      View
                    </Button>

                    <Button
                    variant="secondary"
                    size="sm"
                    onClick={()=>router.visit(route("admin.advertisements.edit",ad.id))}
                    >
                      Edit
                    </Button>

                    <Button
                    variant="destructive"
                    size="sm"
                    onClick={()=>deleteAd(ad.id)}
                    >
                      Delete
                    </Button>

                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </div>

      </div>

      {/* View Modal */}

      <Dialog open={!!viewAd} onOpenChange={()=>setViewAd(null)}>

        <DialogContent className="max-w-xl">

          <DialogHeader>
            <DialogTitle>
              Advertisement Details
            </DialogTitle>
          </DialogHeader>

          {viewAd && (

            <div className="space-y-4">

              <p>
                <strong>Name:</strong> {viewAd.ad_name}
              </p>

              {viewAd.ad_url && (
                <p>
                  <strong>URL:</strong> {viewAd.ad_url}
                </p>
              )}

              {viewAd.ad_image && (
                <img
                src={`/storage/${viewAd.ad_image}`}
                className="rounded border"
                />
              )}

              {viewAd.ad_code && (
                <div>
                  <strong>Ad Code</strong>
                  <pre className="bg-muted p-3 rounded mt-2 text-xs overflow-auto">
                    {viewAd.ad_code}
                  </pre>
                </div>
              )}

            </div>

          )}

        </DialogContent>

      </Dialog>

    </AppLayout>
  )
}