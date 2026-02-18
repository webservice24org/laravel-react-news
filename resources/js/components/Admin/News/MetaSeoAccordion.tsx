"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

const META_TITLE_LIMIT = 60
const META_DESC_LIMIT = 160

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function trimToLimit(s: string, limit: number) {
  return (s || "").slice(0, limit)
}

function stripHtmlToText(html: string) {
  try {
    const doc = new DOMParser().parseFromString(html || "", "text/html")
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim()
  } catch {
    return (html || "").replace(/\s+/g, " ").trim()
  }
}

/** Try to get the first paragraph text from HTML content */
function getFirstParagraphText(html: string) {
  try {
    const doc = new DOMParser().parseFromString(html || "", "text/html")
    const p = doc.querySelector("p")
    const text = (p?.textContent || "").replace(/\s+/g, " ").trim()
    if (text) return text

    // fallback: any text in body
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim()
  } catch {
    return stripHtmlToText(html)
  }
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = clamp((value / max) * 100, 0, 130) // allow overflow visual a bit
  const over = value > max

  return (
    <div className="h-2 w-full rounded bg-neutral-200 overflow-hidden">
      <div
        className={[
          "h-2 transition-all",
          over ? "bg-red-500" : value > max * 0.85 ? "bg-amber-500" : "bg-emerald-500",
        ].join(" ")}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function GooglePreview({ title, description }: { title: string; description: string }) {
  const t = (title || "").trim()
  const d = (description || "").trim()

  const titlePreview =
    t.length > 70 ? t.slice(0, 67).trimEnd() + "…" : (t || "Meta title preview will appear here")
  const descPreview =
    d.length > 180 ? d.slice(0, 177).trimEnd() + "…" : (d || "Meta description preview will appear here")

  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4">
      <div className="text-xs text-neutral-500 mb-1">https://your-site.com › news</div>
      <div className="text-base font-medium text-blue-700 leading-snug">{titlePreview}</div>
      <div className="text-sm text-neutral-700 mt-1 leading-snug">{descPreview}</div>
    </div>
  )
}

export default function MetaSeoAccordion({
  data,
  setData,
  errors = {},
}: {
  data: any
  setData: (key: string, value: any) => void
  errors?: any
}) {
  // ✅ always clamp stored values (defensive)
  const metaTitle = trimToLimit((data.meta_title || "") as string, META_TITLE_LIMIT)
  const metaDesc = trimToLimit((data.meta_description || "") as string, META_DESC_LIMIT)

  // Track whether user manually edited fields (so autofill doesn't overwrite)
  const touchedTitleRef = useRef(false)
  const touchedDescRef = useRef(false)

  const [autoFilledTitle, setAutoFilledTitle] = useState(false)
  const [autoFilledDesc, setAutoFilledDesc] = useState(false)

  const newsTitle = (data.news_title || "") as string
  const newsDescription = (data.news_description || "") as string // HTML from editor

  const suggestedTitle = useMemo(() => {
    const raw = (newsTitle || "").replace(/\s+/g, " ").trim()
    return trimToLimit(raw, META_TITLE_LIMIT) // ✅ clamp suggestion
  }, [newsTitle])

  const suggestedDesc = useMemo(() => {
    const raw = getFirstParagraphText(newsDescription)
    return trimToLimit(raw, META_DESC_LIMIT) // ✅ clamp suggestion
  }, [newsDescription])

  // ✅ Auto-fill meta title (clamped)
  useEffect(() => {
    if (touchedTitleRef.current) return
    if ((data.meta_title || "").trim()) return
    if (!suggestedTitle.trim()) return

    setData("meta_title", trimToLimit(suggestedTitle, META_TITLE_LIMIT))
    setAutoFilledTitle(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedTitle])

  // ✅ Auto-fill meta description (clamped)
  useEffect(() => {
    if (touchedDescRef.current) return
    if ((data.meta_description || "").trim()) return
    if (!suggestedDesc.trim()) return

    setData("meta_description", trimToLimit(suggestedDesc, META_DESC_LIMIT))
    setAutoFilledDesc(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedDesc])

  const titleLen = metaTitle.length
  const descLen = metaDesc.length

  const titleOver = titleLen > META_TITLE_LIMIT
  const descOver = descLen > META_DESC_LIMIT

  return (
    <Accordion type="single" collapsible className="border rounded">
      <AccordionItem value="seo">
        <AccordionTrigger className="px-4">SEO / Meta Information</AccordionTrigger>

        <AccordionContent className="px-4 pb-4">
          <div className="space-y-6">
            {/* ✅ Google Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-neutral-800 dark:text-white">Google Preview</div>
                <div className="text-xs text-neutral-500 dark:text-gray-400">This is an approximate preview</div>
              </div>
              <GooglePreview title={metaTitle} description={metaDesc} />
            </div>

            {/* ================= Meta Title ================= */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Meta Title</Label>

                <div className="flex items-center gap-2">
                  {autoFilledTitle && !touchedTitleRef.current && (
                    <span className="text-xs text-neutral-500">auto-filled</span>
                  )}
                  <span className={`text-xs ${titleOver ? "text-red-600" : "text-neutral-500"}`}>
                    {titleLen}/{META_TITLE_LIMIT}
                  </span>
                </div>
              </div>

              <ProgressBar value={titleLen} max={META_TITLE_LIMIT} />

              <Input
                value={metaTitle}
                maxLength={META_TITLE_LIMIT} // ✅ browser enforcement
                onChange={(e) => {
                  touchedTitleRef.current = true
                  setAutoFilledTitle(false)
                  setData("meta_title", trimToLimit(e.target.value, META_TITLE_LIMIT)) // ✅ hard clamp
                }}
                placeholder="Meta title for SEO (max 60 characters)"
              />

              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-neutral-500">Max {META_TITLE_LIMIT} characters.</div>

                <Button
                  type="button"
                  variant="secondary"
                  className="h-8"
                  onClick={() => {
                    touchedTitleRef.current = false
                    setAutoFilledTitle(true)
                    setData("meta_title", trimToLimit(suggestedTitle || "", META_TITLE_LIMIT)) // ✅ clamp
                  }}
                  disabled={!suggestedTitle}
                  title="Reset to suggested title from News Title"
                >
                  Use News Title
                </Button>
              </div>

              {errors?.meta_title && <p className="text-sm text-red-600">{errors.meta_title}</p>}
            </div>

            {/* ================= Meta Description ================= */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Meta Description</Label>

                <div className="flex items-center gap-2">
                  {autoFilledDesc && !touchedDescRef.current && (
                    <span className="text-xs text-neutral-500">auto-filled</span>
                  )}
                  <span className={`text-xs ${descOver ? "text-red-600" : "text-neutral-500"}`}>
                    {descLen}/{META_DESC_LIMIT}
                  </span>
                </div>
              </div>

              <ProgressBar value={descLen} max={META_DESC_LIMIT} />

              <Textarea
                rows={4}
                value={metaDesc}
                maxLength={META_DESC_LIMIT} // ✅ browser enforcement
                onChange={(e) => {
                  touchedDescRef.current = true
                  setAutoFilledDesc(false)
                  setData("meta_description", trimToLimit(e.target.value, META_DESC_LIMIT)) // ✅ hard clamp
                }}
                placeholder="Meta description for SEO (max 160 characters)"
              />

              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-neutral-500">Max {META_DESC_LIMIT} characters.</div>

                <Button
                  type="button"
                  variant="secondary"
                  className="h-8"
                  onClick={() => {
                    touchedDescRef.current = false
                    setAutoFilledDesc(true)
                    setData("meta_description", trimToLimit(suggestedDesc || "", META_DESC_LIMIT)) // ✅ clamp
                  }}
                  disabled={!suggestedDesc}
                  title="Reset to suggested description from first paragraph"
                >
                  Use First Paragraph
                </Button>
              </div>

              {errors?.meta_description && <p className="text-sm text-red-600">{errors.meta_description}</p>}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
