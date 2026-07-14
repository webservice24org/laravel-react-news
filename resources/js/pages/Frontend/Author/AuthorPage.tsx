"use client"

import React, { useState } from "react"
import { usePage, Link, router } from "@inertiajs/react"
import FrontendLayout from "@/layouts/frontend-layout"
import LatestNews from "@/components/Frontend/Sidebar/LatestNews"
import MostViewedNews from "@/components/Frontend/Sidebar/MostViewedNews"
import SeoHead from "@/components/SeoHead"

declare function route(name: string, params?: any): string

interface Author {
  id: number
  name: string
  is_verified?: boolean
  news_posts_count: number
  profile?: {
    profile_photo?: string
    about?: string
  }
}

interface NewsPost {
  id: number
  news_title: string
  slug: string
  news_thumbnail?: string
}

interface Props {
  author: Author
  news: any
  latestNews: NewsPost[]
  mostViewedNews: NewsPost[]
}

export default function AuthorPage({
  author,
  news,
  latestNews,
  mostViewedNews,
}: Props) {
  const [items, setItems] = useState(news.data)
  const [page, setPage] = useState(news.current_page)
  const { seo } = usePage().props as any;

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : ""


  // Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: author.name,
    url: currentUrl,
  }

  const loadMore = () => {
    router.get(
      route("author.show", author.id),
      { page: page + 1 },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (pageData: any) => {
          setItems([...items, ...pageData.props.news.data])
          setPage(page + 1)
        },
      }
    )
  }

  return (
    <FrontendLayout>
      <SeoHead
        seo={seo}
        authorPage={author}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/">হোম</Link> /{" "}
          <span className="font-medium text-gray-700">
            {author.name}
          </span>
        </div>

        {/* =========================
    Author Header
========================= */}

<div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

    <div className="flex flex-col items-center gap-6 md:flex-row">

        {/* Profile Photo */}

        <div className="shrink-0">

            {author.profile?.profile_photo ? (

                <img
                    src={`/storage/${author.profile.profile_photo}`}
                    alt={author.name}
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg ring-2 ring-red-100"
                />

            ) : (

                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-red-700 text-4xl font-bold text-white shadow-lg">
                    {author.name.charAt(0).toUpperCase()}
                </div>

            )}

        </div>

        {/* Author Details */}

        <div className="flex-1 text-center md:text-left">

            <div className="flex flex-col items-center gap-2 md:flex-row">

                <h1 className="text-3xl font-bold text-gray-900">
                    {author.name}
                </h1>

                {author.is_verified && (
                    <span
                        title="Verified Journalist"
                        className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                    >
                        ✓ Verified
                    </span>
                )}

            </div>

            <p className="mt-2 hidden text-sm font-medium uppercase tracking-wide text-red-600">
                Staff Reporter
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">

                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                    📰 প্রকাশিত লেখার সংখ্যা:
                    <span className="ml-2 font-bold text-red-600">
                        {author.news_posts_count}
                    </span>
                </span>

            </div>

            {author.profile?.about && (

                <p className="mt-5 max-w-3xl leading-8 text-gray-600">
                    {author.profile.about}
                </p>

            )}

        </div>

    </div>

</div>

        <div className="grid grid-cols-12 gap-6">

          {/* LEFT CONTENT */}
          <div className="col-span-12 lg:col-span-9">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: NewsPost) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
                >
                  {item.news_thumbnail && (
                    <img
                      src={`/storage/${item.news_thumbnail}`}
                      alt={item.news_title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2">
                      {item.news_title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            {page < news.last_page && (
              <div className="text-center mt-10">
                <button
                  onClick={loadMore}
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                >
                  আরও দেখুন
                </button>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-6">
              <LatestNews news={latestNews} />
              <MostViewedNews mostViewedNews={mostViewedNews} />
            </div>
          </div>

        </div>
      </div>
    </FrontendLayout>
  )
}