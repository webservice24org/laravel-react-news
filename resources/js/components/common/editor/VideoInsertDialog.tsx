"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function safeUrl(url: string): string {
  const u = (url ?? "").trim()
  if (!u) return ""
  if (/^\s*javascript:/i.test(u)) return ""
  if (!/^https?:\/\//i.test(u)) return ""
  return u
}

function safeExtractIframeSrc(input: string): string {
  const text = input.trim()
  if (!text) return ""
  if (text.toLowerCase().includes("<iframe")) {
    try {
      const doc = new DOMParser().parseFromString(text, "text/html")
      const iframe = doc.querySelector("iframe")
      return safeUrl(iframe?.getAttribute("src") ?? "")
    } catch {
      return ""
    }
  }
  return safeUrl(text)
}

export function VideoInsertDialog({
  trigger,
  disabled,
  onInsertVideo,

  // ✅ optional controlled mode for Replace
  open,
  onOpenChange,
  initial,
  mode = "insert",
}: {
  trigger?: React.ReactNode
  disabled?: boolean
  onInsertVideo: (payload: { src: string; caption?: string; rawInput?: string }) => void

  open?: boolean
  onOpenChange?: (v: boolean) => void
  initial?: { src?: string; caption?: string }
  mode?: "insert" | "replace"
}) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function"
  const realOpen = isControlled ? (open as boolean) : internalOpen
  const setOpen = (v: boolean) => (isControlled ? onOpenChange?.(v) : setInternalOpen(v))

  const [embedInput, setEmbedInput] = useState("")
  const [caption, setCaption] = useState("")

  // preload initial values when opening in replace mode
  useEffect(() => {
    if (!realOpen) return
    if (initial?.src) setEmbedInput(initial.src)
    else setEmbedInput("")
    setCaption(initial?.caption ?? "")
  }, [realOpen, initial?.src, initial?.caption])

  const src = useMemo(() => safeExtractIframeSrc(embedInput), [embedInput])
  const canSubmit = !!src

  const close = () => {
    setOpen(false)
    if (!isControlled) {
      setEmbedInput("")
      setCaption("")
    }
  }

  return (
    <Dialog open={realOpen} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent className="max-w-2xl bg-neutral-950 border-neutral-800 text-neutral-100">
        <DialogHeader>
          <DialogTitle>{mode === "replace" ? "Replace video" : "Insert video"}</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Paste an iframe embed code or a direct embed URL (https://...).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Iframe code / Embed URL</Label>
            <textarea
              value={embedInput}
              onChange={(e) => setEmbedInput(e.target.value)}
              placeholder={`Example:\n<iframe src="https://www.youtube.com/embed/..." ...></iframe>\n\nor\nhttps://player.vimeo.com/video/...`}
              className={[
                "min-h-45 w-full rounded-md",
                "border border-neutral-800 bg-neutral-950",
                "px-3 py-2 text-sm text-neutral-100",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
              ].join(" ")}
              disabled={disabled}
            />
            {!src && embedInput.trim().length > 0 && (
              <div className="text-xs text-red-300">
                Could not detect a valid iframe src / URL (must be http(s)).
              </div>
            )}
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/20 p-3">
            <div className="text-sm font-medium text-neutral-200 mb-2">Preview</div>
            <div className="h-55 w-full overflow-hidden rounded-md border border-neutral-800 bg-neutral-950 flex items-center justify-center">
              {src ? (
                <iframe
                  src={src}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="text-xs text-neutral-500">Paste embed code to preview</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Caption (optional)</Label>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption (shows under the video)"
            className="bg-neutral-950 border-neutral-800"
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="bg-neutral-800 hover:bg-neutral-700">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={() => {
              if (!canSubmit) return
              onInsertVideo({ src, caption: caption.trim() || "", rawInput: embedInput })
              close()
            }}
            disabled={!canSubmit || disabled}
          >
            {mode === "replace" ? "Replace" : "Insert"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
