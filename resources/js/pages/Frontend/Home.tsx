"use client"

import React from "react"
import { Head } from "@inertiajs/react"
import FrontendLayout from "@/layouts/frontend-layout"
import LeadSection from "@/components/Frontend/LeadSection"
import CategorySection from "@/components/Frontend/CategorySection"
import CategoryFiveSplitSection from "@/components/Frontend/CategoryFiveSplitSection"
import CategoryNineSplitSection from "@/components/Frontend/CategoryNineSplitSection"
import CategoryGridSection from "@/components/Frontend/CategoryGridSection"
import FourCategoryBlock from "@/components/Frontend/FourCategoryBlock"
import TwoColumnFeaturedList from "@/components/Frontend/TwoColumnFeaturedList"
import { News } from "@/types/news"

interface Section {
  type: string
  category_slug: string
  news: News[]
}

interface Props {
  leadNews: News[]
  subLeadNews: News[]
  sections: Section[]
}

export default function Home({ leadNews, subLeadNews, sections }: Props) {
  return (
    <FrontendLayout>
      <Head title="Home" />

      {/* Lead Section */}
      <LeadSection
        leadNews={leadNews}
        subLeadNews={subLeadNews}
      />

      {/* Dynamic Sections */}
      {sections.map((section) => {
        if (!section.news?.length) return null

        switch (section.type) {
          case "five_split":
            return (
              <CategoryFiveSplitSection
                key={section.category_slug}
                title={section.category_slug}
                news={section.news}
              />
            )

          case "grid":
            return (
              <CategoryGridSection
                key={section.category_slug}
                title={section.category_slug}
                news={section.news}
              />
            )

          case "nine_split":
            return (
              <CategoryNineSplitSection
                key={section.category_slug}
                title={section.category_slug}
                news={section.news}
              />
            )

          case "four_block":
            // For FourCategoryBlock, wrap as array with single category
            return (
              <FourCategoryBlock
                key={section.category_slug}
                categories={[{ title: section.category_slug, news: section.news }]}
              />
            )

          case "two_column_list":
            return (
              <TwoColumnFeaturedList
                key={section.category_slug}
                title={section.category_slug}
                news={section.news}
              />
            )

          default:
            return (
              <CategorySection
                key={section.category_slug}
                title={section.category_slug}
                news={section.news}
              />
            )
        }
      })}
    </FrontendLayout>
  )
}