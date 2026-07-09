"use client"
declare function route(name: string, params?: any): string
import React from "react"
import { Link } from "@inertiajs/react"
import type { News } from "@/types/news"
import { getExcerpt } from "@/utils/text"


interface Props {
  title: string
  news: News[]
  categorySlug: string
}

export default function CategoryFiveSplitSection({ title, news, categorySlug }: Props) {
  if (!news?.length) return null

  const getImage = (thumbnail?: string) =>
    thumbnail ? `/storage/${thumbnail}` : "/images/fallback-news.jpg"

  // Make middle item featured
  const featuredIndex = Math.floor(news.length / 2)
  const featured = news[featuredIndex]

  // Remove featured from list
  const sideItems = news.filter((_, i) => i !== featuredIndex)

  // Split remaining items equally
  const half = Math.ceil(sideItems.length / 2)
  const leftItems = sideItems.slice(0, half)
  const rightItems = sideItems.slice(half)

  return (
  <section className="max-w-7xl mx-auto mt-8 py-8">
    
    {/* Section Header */}
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-red-600 rounded-full" />
        {categorySlug && (
        <Link
          href={route("category.show", categorySlug)}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        </Link>
      )}
      </div>

      
    </div>

    <div className="grid md:grid-cols-12 gap-8">

      {/* LEFT COLUMN */}
      <div className="md:col-span-3 space-y-5">

        {leftItems.map((item) => (
          <article
            key={item.id}
            className="group border-b pb-5 last:border-0"
          >
            <Link
              href={`/news/${item.slug}`}
              className="block overflow-hidden rounded-lg"
            >
              <img
                src={getImage(item.news_thumbnail)}
                alt={item.news_title}
                loading="lazy"
                decoding="async"
                width="300"
                height="200"
                className="w-full h-40 object-cover transition duration-500"
              />
            </Link>

            <Link href={`/news/${item.slug}`}>
              <h4 className="mt-2 text-lg font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition">
                {item.news_title}
              </h4>
            </Link>
          </article>
        ))}

      </div>

      {/* FEATURED NEWS */}
      <div className="md:col-span-6">

        <article className="group">

          <Link
            href={`/news/${featured.slug}`}
            className="block overflow-hidden rounded-xl"
          >
            <img
              src={getImage(featured.news_thumbnail)}
              alt={featured.news_title}
              loading="lazy"
              decoding="async"
              width="700"
              height="420"
              className="w-full h-95 object-cover transition duration-700"
            />
          </Link>

          <div className="mt-5">

            <Link href={`/news/${featured.slug}`}>
              <h4 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 group-hover:text-red-600 transition">
                {featured.news_title}
              </h4>
            </Link>

            <p className="mt-4 hidden text-gray-600 leading-7 text-base line-clamp-4">
              {getExcerpt(featured.news_description, 35)}
            </p>

            <Link
              href={`/news/${featured.slug}`}
              className="hidden items-center mt-4 text-red-600 font-medium hover:text-red-700"
            >
              Read Full Story →
            </Link>

          </div>

        </article>

      </div>

      {/* RIGHT COLUMN */}
      <div className="md:col-span-3 space-y-5">

        {rightItems.map((item) => (
          <article
            key={item.id}
            className="group border-b pb-5 last:border-0"
          >
            <Link
              href={`/news/${item.slug}`}
              className="block overflow-hidden rounded-lg"
            >
              <img
                src={getImage(item.news_thumbnail)}
                alt={item.news_title}
                loading="lazy"
                decoding="async"
                width="300"
                height="200"
                className="w-full h-40 object-cover transition duration-500"
              />
            </Link>

            <Link href={`/news/${item.slug}`}>
              <h4 className="mt-2 text-lg font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition">
                {item.news_title}
              </h4>
            </Link>
          </article>
        ))}

      </div>

    </div>
  </section>
)
}