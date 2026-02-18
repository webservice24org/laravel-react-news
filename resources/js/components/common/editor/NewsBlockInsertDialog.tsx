"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { UploadCloud } from "lucide-react"

declare function route(name: string, params?: any): string

function getCsrfToken(): string {
  const el = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null
  return el?.content ?? ""
}

function uploadImageToServerWithProgress(
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const form = new FormData()
    form.append("file", file)

    xhr.open("POST", route("admin.uploads.images"), true)
    xhr.withCredentials = true
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    xhr.setRequestHeader("X-CSRF-TOKEN", getCsrfToken())

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return
      onProgress(Math.round((evt.loaded / evt.total) * 100))
    }

    xhr.onload = () => {
      try {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(xhr.responseText || "Upload failed"))
          return
        }
        const json = JSON.parse(xhr.responseText) as { url: string }
        resolve(json.url)
      } catch (e) {
        reject(e)
      }
    }

    xhr.onerror = () => reject(new Error("Network error during upload"))
    xhr.send(form)
  })
}

export type NewsBlockPayload = {
  title: string
  href: string
  image: string
  label?: string
  date?: string
}

export function NewsBlockInsertDialog({
  trigger,
  disabled,
  open,
  onOpenChange,
  mode = "insert",
  initial,
  onSubmit,
}: {
  trigger?: React.ReactNode
  disabled?: boolean
  open?: boolean
  onOpenChange?: (v: boolean) => void
  mode?: "insert" | "edit"
  initial?: Partial<NewsBlockPayload>
  onSubmit: (payload: NewsBlockPayload) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const actualOpen = typeof open === "boolean" ? open : internalOpen
  const setOpen = (v: boolean) => (onOpenChange ? onOpenChange(v) : setInternalOpen(v))

  const [title, setTitle] = useState("")
  const [href, setHref] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [filePreview, setFilePreview] = useState("")
  const [uploadPct, setUploadPct] = useState(0)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  // hydrate for edit mode
  useEffect(() => {
    if (!actualOpen) return
    setTitle(initial?.title ?? "")
    setHref(initial?.href ?? "")
    setImageUrl(initial?.image ?? "")
    setFile(null)
    setUploadPct(0)
    setLoading(false)
    setFilePreview("")
  }, [actualOpen, initial?.title, initial?.href, initial?.image])

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview)
    }
  }, [filePreview])

  const pickFile = (f: File) => {
    if (!f.type.startsWith("image/")) return
    setFile(f)
    setImageUrl("")
    setFilePreview(URL.createObjectURL(f))
  }

  const canSubmit = title.trim() && href.trim() && ((file != null) || imageUrl.trim()) && !loading

  const submit = async () => {
    if (!canSubmit) return
    try {
      setLoading(true)

      let finalImage = imageUrl.trim()
      if (file) {
        setUploadPct(0)
        finalImage = await uploadImageToServerWithProgress(file, setUploadPct)
      }

      onSubmit({
        title: title.trim(),
        href: href.trim(),
        image: finalImage,
        // keep bangla label like screenshot
        label: "আরও পড়ুন",
        // let nodeview format to bn date (today) unless you want to store
        date: "",
      })

      setOpen(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  const previewSrc = filePreview || imageUrl.trim()

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent className="max-w-2xl bg-neutral-950 border-neutral-800 text-neutral-100">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit News Block" : "Insert News Block"}</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Add title, link, and an image to create a news block.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-neutral-950 border-neutral-800"
                placeholder="News title"
                disabled={disabled || loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Link</Label>
              <Input
                value={href}
                onChange={(e) => setHref(e.target.value)}
                className="bg-neutral-950 border-neutral-800"
                placeholder="https://example.com/news"
                disabled={disabled || loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Image</Label>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-neutral-800 hover:bg-neutral-700"
                  disabled={disabled || loading}
                  onClick={() => document.getElementById("news-block-file-input")?.click()}
                >
                  <UploadCloud className="mr-2" size={16} />
                  Upload
                </Button>

                <input
                  id="news-block-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    e.target.value = ""
                    if (f) pickFile(f)
                  }}
                />
              </div>

              {loading && file && (
                <div className="mt-2">
                  <div className="h-2 w-full overflow-hidden rounded bg-neutral-800">
                    <div className="h-2 bg-blue-600 transition-all" style={{ width: `${uploadPct}%` }} />
                  </div>
                  <div className="mt-1 text-xs text-neutral-400">{uploadPct}%</div>
                </div>
              )}

              <div className="mt-2 text-xs text-neutral-400">or paste image URL</div>
              <Input
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  if (e.target.value.trim()) {
                    setFile(null)
                    if (filePreview) URL.revokeObjectURL(filePreview)
                    setFilePreview("")
                    setUploadPct(0)
                  }
                }}
                className="bg-neutral-950 border-neutral-800"
                placeholder="https://example.com/image.jpg"
                disabled={disabled || loading}
              />
            </div>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/20 p-3">
            <div className="text-sm font-medium text-neutral-200 mb-2">Preview</div>
            <div className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 p-4">
              <div className="flex-1 pr-3">
                <div className="text-sm font-semibold text-neutral-400">আরও পড়ুন</div>
                <div className="mt-1 text-base font-bold text-neutral-100 leading-snug">
                  {title.trim() || "আপনার নিউজ টাইটেল এখানে"}
                </div>
                <div className="mt-2 text-xs text-neutral-400">
                  {(() => {
                    try {
                      return new Date().toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })
                    } catch {
                      return new Date().toDateString()
                    }
                  })()}
                </div>
              </div>

              <div className="w-18 overflow-hidden rounded-md border border-neutral-800 bg-neutral-900 flex items-center justify-center">
                {previewSrc ? (
                  <img src={previewSrc} alt="preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-[10px] text-neutral-500 text-center px-2">No image</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="bg-neutral-800 hover:bg-neutral-700" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>

          <Button type="button" onClick={submit} disabled={!canSubmit || disabled}>
            {loading ? "Saving..." : mode === "edit" ? "Update" : "Insert"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
