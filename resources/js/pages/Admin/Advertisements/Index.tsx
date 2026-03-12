declare function route(name: string, params?: any): string

import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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

import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useState } from "react"
import { router } from "@inertiajs/react"
import toast from "react-hot-toast"

import { Input } from "@/components/ui/input"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue
} from "@/components/ui/select"

interface Category {
  id:number
  name:string
}

interface SubCategory {
  id:number
  name:string
}

interface Ad {
  id:number
  ad_name:string
  ad_url?:string
  ad_image?:string
  ad_code?:string
  is_global:boolean
  status:boolean
  categories:Category[]
  sub_categories:SubCategory[]
}

interface PaginationLink {
  url:string | null
  label:string
  active:boolean
}

interface AdsPagination {
  data:Ad[]
  links:PaginationLink[]
}

interface Props {
  ads:AdsPagination
  categories:Category[]
  filters:{
    search?:string
    category?:number
  }
}

export default function Index({ ads, categories, filters }: Props) {

  const [viewAd,setViewAd] = useState<Ad | null>(null)

  const deleteAd = (id:number) => {

    toast.loading("Deleting advertisement...")

    router.delete(route("admin.advertisements.destroy", id), {
      preserveScroll:true,
      onSuccess: () => {
        toast.dismiss()
        toast.success("Advertisement deleted")
      },
      onError: () => {
        toast.dismiss()
        toast.error("Delete failed")
      }
    })

  }

  return (
    <AppLayout>

      <div className="p-10">

        {/* Header */}

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

        <div className="border rounded-lg p-4">

          {/* Filters */}

          <div className="flex gap-4 mb-6">

            {/* Search */}

            <Input
              placeholder="Search advertisement..."
              defaultValue={filters?.search}
              onChange={(e)=>{

                router.get(
                  route("admin.advertisements.index"),
                  { search:e.target.value, category:filters?.category },
                  { preserveState:true, replace:true }
                )

              }}
              className="max-w-sm"
            />

            {/* Category Filter */}

            <Select
              defaultValue={filters?.category?.toString()}
              onValueChange={(value)=>{

                router.get(
                  route("admin.advertisements.index"),
                  { category:value || undefined, search:filters?.search },
                  { preserveState:true, replace:true }
                )

              }}
            >

              <SelectTrigger className="w-50">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">
                  All Categories
                </SelectItem>

                {categories.map(cat=>(
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}

              </SelectContent>

            </Select>

          </div>

          {/* Table */}

          <Table className="border border-border">

            <TableHeader>
              <TableRow>

                <TableHead className="border-r">Ad Name</TableHead>
                <TableHead className="border-r">Category / SubCategory</TableHead>
                <TableHead className="border-r">Global</TableHead>
                <TableHead className="border-r">Status</TableHead>
                <TableHead>Actions</TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>

              {ads.data.map((ad)=>(

                <TableRow key={ad.id}>

                  <TableCell className="font-medium border-r">
                    {ad.ad_name}
                  </TableCell>

                  <TableCell className="border-r">

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

                  <TableCell className="border-r">
                    {ad.is_global ? "Yes" : "No"}
                  </TableCell>

                  <TableCell className="border-r">

                    <div className="flex items-center gap-3">

                      <Switch
                        checked={ad.status}
                        onCheckedChange={() => {

                          router.patch(
                            route("admin.advertisements.toggleStatus", ad.id),
                            {},
                            {
                              preserveScroll:true,
                              onSuccess:()=>toast.success("Status updated"),
                              onError:()=>toast.error("Failed to update")
                            }
                          )

                        }}
                      />

                      <span className={`text-xs px-2 py-1 rounded
                        ${ad.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"}
                      `}>
                        {ad.status ? "Enabled" : "Disabled"}
                      </span>

                    </div>

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

                    <AlertDialog>

                      <AlertDialogTrigger asChild>

                        <Button
                        variant="destructive"
                        size="sm"
                        >
                          Delete
                        </Button>

                      </AlertDialogTrigger>

                      <AlertDialogContent>

                        <AlertDialogHeader>

                          <AlertDialogTitle>
                            Delete Advertisement
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>

                        </AlertDialogHeader>

                        <AlertDialogFooter>

                          <AlertDialogCancel>
                            Cancel
                          </AlertDialogCancel>

                          <AlertDialogAction
                          onClick={()=>deleteAd(ad.id)}
                          >
                            Delete
                          </AlertDialogAction>

                        </AlertDialogFooter>

                      </AlertDialogContent>

                    </AlertDialog>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

          {/* Pagination */}

          <div className="mt-6 flex gap-2 justify-end flex-wrap">

            {ads.links.map((link,i)=>(

              <button
                key={i}
                dangerouslySetInnerHTML={{__html:link.label}}
                disabled={!link.url}
                onClick={()=>link.url && router.visit(link.url)}
                className={`px-3 py-1 border rounded text-sm
                ${link.active ? "bg-black text-white" : ""}`}
              />

            ))}

          </div>

        </div>

      </div>

      {/* View Modal */}

     <Dialog open={!!viewAd} onOpenChange={()=>setViewAd(null)}>

      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Advertisement Details
          </DialogTitle>
        </DialogHeader>

        {viewAd && (

          <div className="space-y-6">

            {/* Ad Image */}

            {viewAd.ad_image && (
              <div className="w-full overflow-hidden rounded-lg border bg-muted flex justify-center">
                <img
                  src={`/storage/${viewAd.ad_image}`}
                  alt={viewAd.ad_name}
                  className="max-h-48 w-auto object-contain"
                />
              </div>
            )}

            {/* Ad Info */}

            <div className="grid grid-cols-2 gap-4 text-sm">

              <div className="space-y-1">
                <p className="text-muted-foreground">Ad Name</p>
                <p className="font-medium">{viewAd.ad_name}</p>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Global Ad</p>
                <span className={`px-2 py-1 text-xs rounded
                  ${viewAd.is_global
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"}
                `}>
                  {viewAd.is_global ? "Yes" : "No"}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Status</p>
                <span className={`px-2 py-1 text-xs rounded
                  ${viewAd.status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"}
                `}>
                  {viewAd.status ? "Enabled" : "Disabled"}
                </span>
              </div>

              {viewAd.ad_url && (
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground">Ad URL</p>
                  <a
                    href={viewAd.ad_url}
                    target="_blank"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {viewAd.ad_url}
                  </a>
                </div>
              )}

            </div>

            {/* Ad Code */}

            {viewAd.ad_code && (
              <div className="space-y-2">

                <p className="text-sm text-muted-foreground">
                  Advertisement Code
                </p>

                <pre className="bg-muted border rounded-md p-4 text-xs overflow-auto">
                {viewAd.ad_code}
                </pre>

              </div>
            )}

            <div className="flex flex-wrap gap-2">

            {viewAd.categories.map(cat=>(
              <span key={cat.id} className="bg-blue-100 px-2 py-1 text-xs rounded">
                {cat.name}
              </span>
            ))}

            {viewAd.sub_categories.map(sub=>(
              <span key={sub.id} className="bg-green-100 px-2 py-1 text-xs rounded">
                {sub.name}
              </span>
            ))}

            </div>

          </div>

        )}

      </DialogContent>

    </Dialog>

    </AppLayout>
  )
}