"use client"

import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import FrontendLayout from "@/layouts/frontend-layout"
import LatestNews from "@/components/Frontend/Sidebar/LatestNews"
import MostViewedNews from "@/components/Frontend/Sidebar/MostViewedNews"

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

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : ""

  const metaTitle = `${author.name} এর সকল সংবাদ | আপনার নিউজ পোর্টাল`
  const metaDescription = `${author.name} এর লেখা সর্বশেষ সংবাদ ও প্রতিবেদন পড়ুন।`

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
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={currentUrl} />

        {/* OpenGraph */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={currentUrl} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/">হোম</Link> /{" "}
          <span className="font-medium text-gray-700">
            {author.name}
          </span>
        </div>

        {/* Author Header */}
        <div className="mb-8 border-b pb-6 flex items-center gap-6">

          {/* Profile Image */}
          <div>
            {author.profile?.profile_photo ? (
              <img
                src={`/storage/${author.profile.profile_photo}`}
                alt={author.name}
                className="w-24 h-24 rounded-full object-cover border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                {author.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Author Info */}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {author.name}
              {author.is_verified && (
                <span className="text-blue-600 font-semibold text-lg" title="Verified Journalist">
                  ✔
                </span>
              )}
            </h1>

            <p className="text-gray-600 mt-1">
              মোট প্রকাশিত সংবাদ:{" "}
              <span className="font-semibold">{author.news_posts_count}</span>
            </p>

            {author.profile?.about && (
              <p className="text-gray-600 mt-2">
                {author.profile.about}
              </p>
            )}
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