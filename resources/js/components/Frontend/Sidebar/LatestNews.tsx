"use client"

import React from "react"
import { Link } from "@inertiajs/react"

declare function route(name: string, params?: any): string

interface NewsItem {
  id: number
  news_title: string
  slug: string
  created_at: string
  news_thumbnail?: string
}

interface Props {
  title?: string
  news: NewsItem[]
}

export default function LatestNews({ title = "সর্বশেষ সংবাদ", news }: Props) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 border-b pb-2">
        {title}
      </h3>

      <div className="space-y-4">
        {news?.length > 0 ? (
            news.map((item) => (
            <Link
                key={item.id}
                href={route("news.show", item.slug)}
                className="flex gap-3 group"
            >
                {item.news_thumbnail && (
                <img
                    src={`/storage/${item.news_thumbnail}`}
                    alt={item.news_title}
                    className="w-20 h-14 object-cover rounded"
                />
                )}

                <div>
                <h4 className="text-sm font-medium group-hover:text-red-600 transition">
                    {item.news_title}
                </h4>
                </div>
            </Link>
            ))
        ) : (
            <p className="text-sm text-gray-500">কোন সংবাদ পাওয়া যায়নি</p>
        )}
        </div>
    </div>
  )
}