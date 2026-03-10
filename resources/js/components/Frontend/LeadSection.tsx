"use client"

import { News } from "@/types/news"
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
          </div>

        </div>
      </div>
    </section>
  )
}