"use client"

import React from "react"
import { Link, usePage } from "@inertiajs/react"
import ArchiveDatePicker from "@/components/Frontend/ArchiveDatePicker";

declare function route(name: string, params?: any): string

interface NewsItem {
  id: number
  news_title: string
  slug: string
  published_at?: string
  news_thumbnail?: string
}

interface Props {
  title?: string
  news: NewsItem[]
}

export default function LatestNews({ title = "সর্বশেষ সংবাদ", news }: Props) {
  const { frontendSettings } = usePage().props as any;

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-md font-bold mb-4 border-b pb-2">
          আর্কাইভ
        </h3>
        <ArchiveDatePicker
            placeholder="Archive"
        />
      </div>
        <div className="bg-white p-4 rounded-lg shadow">
          
          <h3 className="text-lg font-bold mb-4 border-b pb-2">
            {frontendSettings.latest_news_title || title}
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
    </div>
    
  )
}