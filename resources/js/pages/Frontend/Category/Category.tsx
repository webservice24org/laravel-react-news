"use client"

import React, { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import FrontendLayout from "@/layouts/frontend-layout"
import LatestNews from "@/components/Frontend/Sidebar/LatestNews"
import MostViewedNews from "@/components/Frontend/Sidebar/MostViewedNews"

declare function route(name: string, params?: any): string

interface Category {
  id: number
  name: string
  slug: string
}

interface NewsPost {
  id: number
  news_title: string
  slug: string
  news_thumbnail?: string
  created_at: string
}

interface PaginationMeta {
  current_page: number
  last_page: number
}

interface PaginatedNews {
  data: NewsPost[]
  meta: PaginationMeta
}

interface Props {
  category: Category
  news: any
  latestNews: NewsPost[]
  mostViewedNews: NewsPost[]
}

export default function CategoryPage({
  category,
  news,
  latestNews,
  mostViewedNews,
}: Props) {

  const [items, setItems] = useState(news.data)
  const [page, setPage] = useState(news.current_page)

  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : ""

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : ""

  const metaTitle = `${category?.name} সংবাদ | আপনার নিউজ পোর্টাল`
  const metaDescription = `${category?.name} সম্পর্কিত সর্বশেষ আপডেট, ব্রেকিং নিউজ এবং গুরুত্বপূর্ণ প্রতিবেদন পড়ুন।`

  // ===============================
  // Structured Data (CollectionPage)
  // ===============================
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category?.name,
    url: currentUrl,
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "হোম",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category?.name,
        item: currentUrl,
      },
    ],
  }

  // ===============================
  // Load More
  // ===============================
  const loadMore = () => {
    router.get(
      route("category.show", category.slug),
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
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={currentUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb UI */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/">হোম</Link> /{" "}
          <span className="text-gray-700 font-medium">
            {category?.name}
          </span>
        </div>

        {/* Category Title */}
        <h1 className="text-3xl font-bold mb-8 border-b pb-3">
          {category?.name}
        </h1>

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

            {/* Load More Button */}
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