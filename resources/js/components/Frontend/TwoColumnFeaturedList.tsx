"use client"

import React from "react"
declare function route(name: string, params?: any): string
import { Link } from "@inertiajs/react"
import type { News } from "@/types/news"
import { getExcerpt } from "@/utils/text"

interface Props {
  title: string
  news: News[]
  categorySlug?: string
}

export default function TwoColumnFeaturedList({
  title,
  news,
  categorySlug,
}: Props) {
  if (!news?.length) return null

  const [featured, ...listNews] = news.slice(0, 6)

  const getImage = (thumbnail?: string) =>
    thumbnail
      ? `/storage/${thumbnail}`
      : "/images/fallback-news.jpg"

  return (
    <section className="max-w-7xl mx-auto py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-red-600 rounded-full" />
              {categorySlug && (
              <Link
                href={route("category.show", categorySlug)}
                className="text-sm group font-medium text-red-600 hover:text-red-700"
              >
                <h2 className="text-2xl md:text-3xl font-bold group-hover:text-red-600 text-gray-900">
                {title}
              </h2>
              </Link>
            )}
            </div>
      
            
          </div>

      <div className="grid md:grid-cols-12 gap-8">

        {/* Featured Story */}
        <div className="md:col-span-6">
          {featured && (
            <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

              <Link href={`/news/${featured.slug}`}>
                <img
                  src={getImage(featured.news_thumbnail)}
                  alt={featured.news_title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-80 object-cover"
                />
              </Link>

              <div className="p-5">

                <Link href={`/news/${featured.slug}`}>
                  <h3 className="text-2xl font-bold leading-tight text-gray-900 hover:text-red-600 transition-colors">
                    {featured.news_title}
                  </h3>
                </Link>

                <p className="mt-3 text-gray-600 leading-7 line-clamp-4">
                  {getExcerpt(
                    featured.news_description,
                    35
                  )}
                </p>

                <Link
                  href={`/news/${featured.slug}`}
                  className="inline-flex items-center mt-4 text-red-600 font-medium hover:text-red-700"
                >
                  Read Full Story →
                </Link>

              </div>
            </article>
          )}
        </div>

        {/* Right Side News Cards */}
        <div className="md:col-span-6 space-y-4">

          {listNews.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-2">

                <Link
                  href={`/news/${item.slug}`}
                  className="shrink-0"
                >
                  <img
                    src={getImage(item.news_thumbnail)}
                    alt={item.news_title}
                    loading="lazy"
                    decoding="async"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1">

                  <Link href={`/news/${item.slug}`}>
                    <h4 className="font-bold text-gray-900 leading-snug line-clamp-2 hover:text-red-600 transition-colors">
                      {item.news_title}
                    </h4>
                  </Link>

                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {getExcerpt(
                      item.news_description,
                      12
                    )}
                  </p>

                </div>

              </div>
            </article>
          ))}

        </div>

      </div>
    </section>
  )
}