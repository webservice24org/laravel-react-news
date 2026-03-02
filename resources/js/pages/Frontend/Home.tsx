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
  // Group sections into four-category blocks
  const groupedFourBlocks: Section[][] = []
  let temp: Section[] = []

  sections.forEach((section) => {
    if (section.type === "four-category-block") {
      temp.push(section)
      if (temp.length === 4) {
        groupedFourBlocks.push(temp)
        temp = []
      }
    }
  })
  // Push remaining if less than 4
  if (temp.length) groupedFourBlocks.push(temp)

  return (
    <FrontendLayout>
      <Head title="Home" />

      {/* Lead Section */}
      <LeadSection leadNews={leadNews} subLeadNews={subLeadNews} />

      {/* Dynamic Sections */}
      {sections.map((section) => {
        // Skip sections included in FourCategoryBlock groups
        if (section.type === "four-category-block") return null

        if (!section.news?.length) return null

        switch (section.type) {
          case "category-five-split":
            return (
              <CategoryFiveSplitSection
                key={section.category_slug}
                title={section.category_slug}
                news={section.news}
              />
            )

          case "category-grid":
            return (
              <CategoryGridSection
                key={section.category_slug}
                title={section.category_slug}
                news={section.news}
              />
            )

          case "category-nine-split":
            return (
              <CategoryNineSplitSection
                key={section.category_slug}
                title={section.category_slug}
                news={section.news}
              />
            )

          case "two-column-featured-list":
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

      {/* Render FourCategoryBlocks */}
      {groupedFourBlocks.map((group, index) => (
        <FourCategoryBlock
          key={`four-block-${index}`}
          categories={group.map((section) => ({
            title: section.category_slug,
            news: section.news.slice(0, 6), // only latest 6 news per category
          }))}
        />
      ))}
    </FrontendLayout>
  )
}