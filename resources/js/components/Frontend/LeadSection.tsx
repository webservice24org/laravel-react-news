"use client"

import { News } from "@/types/news"
import { Link, usePage } from "@inertiajs/react"
import React from "react"
import LeadMain from "./LeadMain"
import LeadGrid from "./LeadGrid"
import SubLeadSection from "./SubLeadSection"


interface Props {
  leadNews: News[]
  subLeadNews: News[]
}

export default function LeadSection({ leadNews, subLeadNews }: Props) {
  if (!leadNews?.length) return null

  const latest = leadNews[0]
  const rest = leadNews.slice(1, 10)
  const { advertisements } = usePage().props as any;

const homeRightOne = advertisements?.find(
    (ad: any) => ad.ad_name === "Home Right Sidebar One"
);

  return (
    <section className="max-w-7xl mx-auto py-2">
      <div className="container  px-4">
        <div className="grid grid-cols-12 gap-6">
          
          {/* LEFT SIDE */}
          <div className="col-span-12 lg:col-span-8 space-y-2">
            <LeadMain news={latest} />
            <LeadGrid news={rest} />
          </div>

          {/* RIGHT SIDE */}
          <div className="col-span-12 lg:col-span-4">
            <SubLeadSection news={subLeadNews} />

            <div className="mt-4">
              {homeRightOne ? (
                  homeRightOne.ad_code ? (
                      <div
                          className="overflow-hidden rounded-lg"
                          dangerouslySetInnerHTML={{
                              __html: homeRightOne.ad_code,
                          }}
                      />
                  ) : (
                      <a
                          href={homeRightOne.ad_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition"
                      >
                          <img
                              src={homeRightOne.ad_image}
                              alt={homeRightOne.ad_name}
                              className="w-full h-auto"
                          />
                      </a>
                  )
              ) : (
                  <div className="bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg">
                      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
                          <span className="text-gray-500">
                              Advertisement
                          </span>
                      </div>
                  </div>
              )}
          </div>

          </div>

        </div>
      </div>
    </section>
  )
}