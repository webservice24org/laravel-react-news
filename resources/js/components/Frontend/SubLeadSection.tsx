"use client"

import React from "react"
import type { News } from "@/types/news"
import { Link } from "@inertiajs/react"

interface Props {
  news: News[]
}

export default function SubLeadSection({ news }: Props) {
  if (!news?.length) return null

  return (
    <div className="bg-gray-50 p-5 rounded-lg h-full">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        Sub Lead News
      </h2>

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            
            <Link href={`/news/${item.slug}`}>
              <img
                src={`/storage/${item.news_thumbnail}`}
                alt={item.news_title}
                className="w-20 h-20 object-cover rounded-md"
              />
            </Link>

            <Link href={`/news/${item.slug}`}>
              <h4 className="font-semibold line-clamp-2 hover:text-red-600 transition">
                {item.news_title}
              </h4>
            </Link>

          </div>
        ))}
      </div>
    </div>
  )
}