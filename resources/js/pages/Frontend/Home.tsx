"use client"

import React from "react"
import SeoHead from "@/components/SeoHead"
import FrontendLayout from "@/layouts/frontend-layout"
import LeadSection from "@/components/Frontend/LeadSection"
import CategorySection from "@/components/Frontend/CategorySection"
import CategoryFiveSplitSection from "@/components/Frontend/CategoryFiveSplitSection"
import CategoryNineSplitSection from "@/components/Frontend/CategoryNineSplitSection"
import CategoryGridSection from "@/components/Frontend/CategoryGridSection"
import FourCategoryBlock from "@/components/Frontend/FourCategoryBlock"
import TwoColumnFeaturedList from "@/components/Frontend/TwoColumnFeaturedList"
import CategoryFourPremiumSection from "@/components/Frontend/CategoryFourPremiumSection"
import { News } from "@/types/news"
import { Head, usePage } from "@inertiajs/react";

interface Category {
  id: number
  name: string
  slug: string
}

interface Section {
  id: number
  type: string
  category_slug: string
  category?: Category
  news: News[]
}

interface Props {
  leadNews: News[]
  subLeadNews: News[]
  sections: Section[]
}

export default function Home({ leadNews, subLeadNews, sections }: Props) {
  const { seo } = usePage().props as any;
  /*
    ===============================
    GROUP FOUR-CATEGORY BLOCKS
    ===============================
    Each block contains 4 sections
  */
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

  if (temp.length) {
    groupedFourBlocks.push(temp)
  }

  return (
    <FrontendLayout>
         <SeoHead seo={seo} />

      {/* ================= Lead Section ================= */}
      <LeadSection
        leadNews={leadNews}
        subLeadNews={subLeadNews}
      />

      {/* ================= Normal Sections ================= */}
      {sections.map((section) => {
        // Skip four-category-block here (rendered later grouped)
        if (section.type === "four-category-block") return null

        // Skip empty
        if (!section.news?.length) return null

        const title =
          section.category?.name ?? section.category_slug

        switch (section.type) {
          case "category-five-split":
            return (
              <CategoryFiveSplitSection
                key={section.id}
                title={title}
                news={section.news}
                categorySlug={section.category_slug}
              />
            )

          case "category-grid":
            return (
              <CategoryGridSection
                key={section.id}
                title={title}
                news={section.news}
                categorySlug={section.category_slug}
              />
            )

          case "category-nine-split":
            return (
              <CategoryNineSplitSection
                key={section.id}
                title={title}
                news={section.news}
                categorySlug={section.category_slug}
              />
            )

          case "two-column-featured-list":
            return (
              <TwoColumnFeaturedList
                key={section.id}
                title={title}
                news={section.news}
                categorySlug={section.category_slug}
              />
            )
          case "category-four-premium":
            return (
              <CategoryFourPremiumSection
                key={section.id}
                title={title}
                news={section.news}
                categorySlug={section.category_slug}
              />
            )

          default:
            return (
              <CategorySection
                key={section.id}
                title={title}
                news={section.news}
                categorySlug={section.category_slug}
              />
            )
        }
      })}

      {/* ================= Four Category Blocks ================= */}
      {groupedFourBlocks.map((group, index) => (
        <FourCategoryBlock
          key={`four-block-${index}`}
          categories={group.map((section) => ({
            title:
              section.category?.name ?? section.category_slug,
            news: section.news.slice(0, 6), // Latest 6 news
          }))}
        />
      ))}
    </FrontendLayout>
  )
}