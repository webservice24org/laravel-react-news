"use client"

import React, { useState } from "react"
import { usePage, Link, router } from "@inertiajs/react"
import FrontendLayout from "@/layouts/frontend-layout"
import LatestNews from "@/components/Frontend/Sidebar/LatestNews"
import MostViewedNews from "@/components/Frontend/Sidebar/MostViewedNews"
import SeoHead from "@/components/SeoHead"

declare function route(name: string, params?: any): string

interface Category {
  id: number
  name: string
  slug: string
}

interface SubCategory {
  id: number
  name: string
  slug: string
}

interface NewsPost {
  id: number
  news_title: string
  slug: string
  news_thumbnail?: string
}

interface Props {
  category: Category
  subCategory: SubCategory
  news: any
  latestNews: NewsPost[]
  mostViewedNews: NewsPost[]
}

export default function SubCategoryPage({
  category,
  subCategory,
  news,
  latestNews,
  mostViewedNews,
}: Props) {

  const [items, setItems] = useState(news.data)
  const [page, setPage] = useState(news.current_page)
  const { seo } = usePage().props as any;

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : ""

  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : ""


  // Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: subCategory.name,
    url: currentUrl,
  }

  const loadMore = () => {
    router.get(
      route("subcategory.show", [category.slug, subCategory.slug]),
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

      <SeoHead seo={seo} subCategory={subCategory} />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/">হোম</Link> /{" "}
          <Link href={route("category.show", category.slug)}>
            {category.name}
          </Link>{" "}
          /{" "}
          <span className="font-medium text-gray-700">
            {subCategory.name}
          </span>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 border-b pb-3">
          {category.name} &gt;&gt; {subCategory.name}
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