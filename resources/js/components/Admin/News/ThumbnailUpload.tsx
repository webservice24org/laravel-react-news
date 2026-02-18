"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {
  data: any
  setData: (key: any, value: any) => void
  errors?: any
  existingUrl?: string | null // from backend for Edit page
  maxMB?: number
  allowedTypes?: string[]
}

export default function ThumbnailUpload({
  data,
  setData,
  errors = {},
  existingUrl = null,
  maxMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)

  const hasNewFile = data.news_thumbnail instanceof File
  const isRemoved = String(data.remove_thumbnail || "") === "1"

  const previewUrl = useMemo(() => {
    if (hasNewFile && localPreview) return localPreview
    if (!hasNewFile && !isRemoved && existingUrl) return existingUrl
    return null
  }, [hasNewFile, localPreview, existingUrl, isRemoved])

  // create/revoke preview for new files
  useEffect(() => {
    if (!hasNewFile) {
      setLocalPreview(null)
      return
    }
    const url = URL.createObjectURL(data.news_thumbnail)
    setLocalPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [hasNewFile, data.news_thumbnail])

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed: JPG, PNG, WEBP.`
    }
    const mb = file.size / (1024 * 1024)
    if (mb > maxMB) {
      return `Image too large. Max ${maxMB}MB allowed.`
    }
    return null
  }

  const pickFile = (file: File | null) => {
    setConfirmRemove(false)
    setClientError(null)

    if (!file) return

    const err = validateFile(file)
    if (err) {
      setClientError(err)
      // keep previous file/preview intact
      return
    }

    // replacing thumbnail cancels remove flag
    setData("remove_thumbnail", "")
    setData("news_thumbnail", file)
  }

  const openPicker = () => {
    setConfirmRemove(false)
    setClientError(null)
    inputRef.current?.click()
  }

  const removeThumb = () => {
    // first click -> ask confirm
    if (!confirmRemove) {
      setConfirmRemove(true)
      return
    }

    // confirmed
    setConfirmRemove(false)
    setClientError(null)

    // clear file and mark remove
    setData("news_thumbnail", null)
    setData("remove_thumbnail", "1")
  }

  const cancelRemove = () => setConfirmRemove(false)

  return (
    <div className="space-y-3">
      {/* Hidden file input */}
      <Input
        ref={inputRef as any}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null
          e.target.value = ""
          pickFile(f)
        }}
      />

      {/* Preview box */}
      <div className="rounded border bg-white p-1 space-y-2">
        {previewUrl ? (
          <div className="space-y-2">
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              className="w-full rounded border object-cover"
              style={{ aspectRatio: "16/9" }}
            />

            <div className="flex items-center gap-1">
              <Button size="sm" type="button" variant="outline" onClick={openPicker}>
                Replace image
              </Button>

              <Button size="sm"
                type="button"
                variant={confirmRemove ? "destructive" : "outline"}
                onClick={removeThumb}
              >
                {confirmRemove ? "Click again to remove" : "Remove image"}
              </Button>

              {confirmRemove && (
                <Button type="button" size="sm" variant="ghost" onClick={cancelRemove}>
                  Cancel
                </Button>
              )}
            </div>

            {/* Status helper */}
            <div className="text-xs text-neutral-500">
              {hasNewFile
                ? "New image selected (will replace current on update)."
                : "Current image is saved."}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="rounded border border-dashed p-4 text-sm text-neutral-600">
              No featured image selected.
            </div>

            <Button type="button" variant="outline" onClick={openPicker}>
              Set featured image
            </Button>

            {confirmRemove && (
              <div className="text-xs text-red-600">
                Remove is pending. (This shouldn’t happen without preview.)
              </div>
            )}
          </div>
        )}

        {/* Caption */}
        <div className="space-y-2">
          <Label className="text-sm">Caption (optional)</Label>
          <Input
            value={data.thumbnail_caption || ""}
            onChange={(e) => setData("thumbnail_caption", e.target.value)}
            placeholder="Write a caption for the image"
          />
          {errors.thumbnail_caption && (
            <p className="text-sm text-red-600">{errors.thumbnail_caption}</p>
          )}
        </div>
      </div>

      {/* Errors */}
      {clientError && <p className="text-sm text-red-600">{clientError}</p>}
      {errors.news_thumbnail && <p className="text-sm text-red-600">{errors.news_thumbnail}</p>}
    </div>
  )
}
