"use client"

import React from "react"
import { Head, Link } from "@inertiajs/react"
import FrontendLayout from "@/layouts/frontend-layout"
import LatestNews from "@/components/Frontend/Sidebar/LatestNews"

declare function route(name: string, params?: any): string

interface Category {
  id: number
  name: string
  slug: string
}

interface Author {
  id: number
  name: string
}

interface NewsPost {
  id: number
  news_title: string
  slug: string
  news_description: string
  news_thumbnail?: string
  thumbnail_caption?: string
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at?: string
  view_count: number
  categories: Category[]
  author?: Author
}

interface Props {
  news: NewsPost
   latestNews: any[]
}

export default function Show({ news, latestNews }: Props) {

  // ==============================
  // Bangla Relative Time
  // ==============================
  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diff = Math.floor((now.getTime() - past.getTime()) / 60000)

    if (diff < 60) return `${diff} মিনিট আগে`
    const hours = Math.floor(diff / 60)
    if (hours < 24) return `${hours} ঘণ্টা আগে`
    const days = Math.floor(hours / 24)
    return `${days} দিন আগে`
  }

  // ==============================
  // Full Bangla Date Format
  // ==============================
  const formatBanglaDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " " +
    new Date(dateString).toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <FrontendLayout>
      <Head>
        <title>{news.meta_title || news.news_title}</title>
        <meta
          name="description"
          content={news.meta_description || news.news_title}
        />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ================= BREADCRUMB ================= */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600">হোম</Link>
          {" / "}
          {news.categories[0]?.name}
          {" / "}
          <span className="text-gray-700">{news.news_title}</span>
        </div>

        {/* ================= 12 Column Layout ================= */}
        <div className="grid grid-cols-12 gap-6">

          {/* ========= LEFT 2 COL (Meta Info) ========= */}
          <div className="col-span-12 lg:col-span-2 text-sm text-gray-600 space-y-3 shadow-sm p-2 rounded bg-gray-50">

            <div>
              <strong>লেখক:</strong><br />
              {news.author?.name || "নিজস্ব প্রতিবেদক"}
            </div>

            <div>
              {getRelativeTime(news.created_at)}
            </div>

            <div>
              <strong>আপডেট:</strong><br />
              {formatBanglaDate(news.updated_at || news.created_at)}
            </div>

            <div>
              <strong>বিভাগ:</strong><br />
              {news.categories[0]?.name}
            </div>

            {/* Share Buttons */}
            <div className="pt-4 space-y-2">
              <div className="font-semibold">শেয়ার করুন:</div>
              <div className="flex gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                  target="_blank"
                  className="bg-blue-600 text-white px-2 py-1 text-xs rounded"
                >
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                  target="_blank"
                  className="bg-black text-white px-2 py-1 text-xs rounded"
                >
                  X
                </a>
              </div>
            </div>
          </div>

          {/* ========= MIDDLE 7 COL ========= */}
          <div className="col-span-12 lg:col-span-7 shadow-sm p-2 rounded bg-white">

            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              {news.news_title}
            </h1>

            {news.news_thumbnail && (
              <div className="mb-6">
                <img
                  src={`/storage/${news.news_thumbnail}`}
                  alt={news.news_title}
                  className="w-full rounded"
                />
                {news.thumbnail_caption && (
                  <p className="text-xs text-gray-500 mt-1">
                    {news.thumbnail_caption}
                  </p>
                )}
              </div>
            )}

            <div
            className="prose max-w-none text-lg leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: news.news_description,
            }}
          />
          </div>

          {/* ========= RIGHT 3 COL (Sidebar) ========= */}
            <div className="col-span-12 lg:col-span-3">
                <LatestNews news={latestNews} />
            </div>
        </div>

        

      </div>
    </FrontendLayout>
  )
}