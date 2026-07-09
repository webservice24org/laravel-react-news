"use client"

import React from "react"
declare function route(name: string, params?: any): string
import { Link } from "@inertiajs/react"
import type { News } from "@/types/news"
import { getExcerpt } from "@/utils/text"

interface Props {
  title: string
  news: News[]
  categorySlug: string
}

export default function CategorySection({ title, news, categorySlug }: Props) {
  if (!news?.length) return null

  const [featured, ...others] = news

  const getImage = (thumbnail?: string) =>
    thumbnail ? `/storage/${thumbnail}` : "/images/fallback-news.jpg"

  return (
    <section className="max-w-7xl mt-8 mx-auto py-8">

  {/* Section Header */}
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-3">
      <div className="w-1 h-8 bg-red-600 rounded-full" />

      {categorySlug ? (
        <Link
          href={route("category.show", categorySlug)}
          className="group"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-red-600 transition">
            {title}
          </h2>
        </Link>
      ) : (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
      )}
    </div>

    {categorySlug && (
      <Link
        href={route("category.show", categorySlug)}
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        View All →
      </Link>
    )}
  </div>

  <div className="grid md:grid-cols-12 gap-8">

    {/* FEATURED */}
    <div className="md:col-span-6">

      <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">

        <Link href={`/news/${featured.slug}`}>
          <img
            src={getImage(featured.news_thumbnail)}
            alt={featured.news_title}
            loading="lazy"
            decoding="async"
            className="w-full h-95 object-cover"
          />
        </Link>

        <div className="p-6">

          <Link href={`/news/${featured.slug}`}>
            <h3 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 hover:text-red-600 transition">
              {featured.news_title}
            </h3>
          </Link>

          <p className="mt-4 text-gray-600 leading-7 line-clamp-4">
            {getExcerpt(featured.news_description, 35)}
          </p>

        </div>

      </article>

    </div>

    {/* RIGHT STORIES */}
    {/* Right 4 News */}
<div className="md:col-span-6 grid grid-cols-2 gap-3">
  {others.slice(0, 4).map((item) => (
    <article
      key={item.id}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <Link href={`/news/${item.slug}`}>
        <img
          src={getImage(item.news_thumbnail)}
          alt={item.news_title}
          loading="lazy"
          decoding="async"
          width="300"
          height="200"
          className="w-full h-36 object-cover"
        />
      </Link>

      <div className="p-4">
        <Link href={`/news/${item.slug}`}>
          <h4 className="text-base font-semibold leading-snug text-gray-900 line-clamp-2 transition-colors hover:text-red-600">
            {item.news_title}
          </h4>
        </Link>

        <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-2">
          {getExcerpt(item.news_description, 12)}
        </p>

        <Link
          href={`/news/${item.slug}`}
          className="mt-3 inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700"
        >
          বিস্তারিত →
        </Link>
      </div>
    </article>
  ))}
</div>

  </div>

</section>
  )
}