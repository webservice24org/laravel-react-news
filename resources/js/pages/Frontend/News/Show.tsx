"use client"

import React from "react"
import { Head, Link } from "@inertiajs/react"
import FrontendLayout from "@/layouts/frontend-layout"
import LatestNews from "@/components/Frontend/Sidebar/LatestNews"
import RelatedNews from "@/components/Frontend/Sidebar/RelatedNews"
import MostViewedNews from "@/components/Frontend/Sidebar/MostViewedNews"
import toast from "react-hot-toast"

declare function route(name: string, params?: any): string

interface Category {
  id: number
  name: string
  slug: string
}

interface Author {
  id: number
  name: string
}

interface NewsPost {
  id: number
  news_title: string
  slug: string
  news_description: string
  news_thumbnail?: string
  thumbnail_caption?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  created_at: string
  updated_at?: string
  view_count: number
  categories: Category[]
  author?: Author
}

interface Props {
  news: NewsPost
  latestNews: NewsPost[]
  mostViewedNews: NewsPost[]
  relatedNews: NewsPost[]
  previousNews?: NewsPost
  nextNews?: NewsPost
}

export default function Show({
  news,
  latestNews,
  mostViewedNews,
  relatedNews,
  previousNews,
  nextNews,
}: Props) {

  const category = news.categories?.[0]

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : ""

  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : ""

  const imageUrl = news.news_thumbnail
    ? `${siteUrl}/storage/${news.news_thumbnail}`
    : `${siteUrl}/logo.png`

  const publishedDate = new Date(news.created_at).toISOString()
  const updatedDate = new Date(news.updated_at ?? news.created_at).toISOString()

  // ==============================
  // Google News Structured Data
  // ==============================
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
    headline: news.news_title,
    description:
      news.meta_description ||
      news.news_title.substring(0, 150),
    image: [imageUrl],
    datePublished: publishedDate,
    dateModified: updatedDate,
    author: {
      "@type": "Person",
      name: news.author?.name || "নিজস্ব প্রতিবেদক",
    },
    publisher: {
      "@type": "Organization",
      name: "আপনার নিউজ পোর্টাল",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(currentUrl)
    toast.success("লিংক কপি হয়েছে!")
  }

  return (
    <FrontendLayout>
      <Head>
        <title>{news.meta_title || news.news_title}</title>

        {/* Basic SEO */}
        <meta
          name="description"
          content={
            news.meta_description ||
            news.news_title.substring(0, 150)
          }
        />
        <meta
          name="keywords"
          content={news.meta_keywords || ""}
        />

        <link rel="canonical" href={currentUrl} />

        {/* OpenGraph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={news.news_title} />
        <meta
          property="og:description"
          content={
            news.meta_description ||
            news.news_title.substring(0, 150)
          }
        />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="আপনার নিউজ পোর্টাল" />

        {/* Article Info */}
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:modified_time" content={updatedDate} />
        <meta property="article:author" content={news.author?.name || ""} />
        {category && (
          <meta property="article:section" content={category.name} />
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={news.news_title} />
        <meta
          name="twitter:description"
          content={
            news.meta_description ||
            news.news_title.substring(0, 150)
          }
        />
        <meta name="twitter:image" content={imageUrl} />

        {/* AMP future ready */}
        <link rel="amphtml" href={`${siteUrl}/amp/news/${news.slug}`} />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      {/* Floating Share */}
      <div className="hidden lg:flex flex-col gap-3 fixed top-1/3 right-6 z-50 no-print">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
          target="_blank"
          className="bg-blue-600 text-white p-3 rounded-full shadow"
        >
          FB
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${currentUrl}`}
          target="_blank"
          className="bg-black text-white p-3 rounded-full shadow"
        >
          X
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-black transition">
            হোম
          </Link>

          {category && (
            <>
              {" / "}
              <Link
                href={route("category.show", category.slug)}
                className="text-gray-600 hover:text-black font-medium transition"
              >
                {category.name}
              </Link>
            </>
          )}

          {" / "}
          <span className="text-gray-700">
            {news.news_title}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR META */}
          <div className="col-span-12 lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-4 text-sm text-gray-600 bg-gray-50 p-4 rounded shadow-sm no-print">


              <div>
                <strong>লেখক:</strong><br />

                {news.author ? (
                  <Link
                    href={route("author.show", news.author.id)}
                    className="inline-block bg-gray-100 px-2 py-1 rounded text-sm hover:bg-gray-200 transition"
                  >
                    {news.author.name}
                  </Link>
                ) : (
                  "নিজস্ব প্রতিবেদক"
                )}
              </div>

              <div>
                <strong>ভিউ:</strong><br />
                {news.view_count}
              </div>

              <div className="pt-4 space-y-2">

                <a
                  href={route("news.download", news.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gray-200 py-2 rounded text-center block"
                  onClick={() => {
                    toast.success("PDF ডাউনলোড শুরু হয়েছে")
                  }}
                >
                  🖨 Download PDF
                </a>

                <button
                  onClick={copyLink}
                  className="w-full bg-gray-200 py-2 rounded"
                >
                  🔗 Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="col-span-12 lg:col-span-7">

            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
              {news.news_title}
            </h1>

            {news.news_thumbnail && (
              <div className="mb-6">
                <img
                  src={`/storage/${news.news_thumbnail}`}
                  alt={news.news_title}
                  className="w-full max-h-[500px] object-contain rounded bg-gray-100"
                />
                {news.thumbnail_caption && (
                  <p className="text-xs text-gray-500 mt-1">
                    {news.thumbnail_caption}
                  </p>
                )}
              </div>
            )}

            <div
              className="prose max-w-none text-lg leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: news.news_description,
              }}
            />
            {/* Previous / Next */} <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-10"> {previousNews && ( <Link href={`/news/${previousNews.slug}`} className="p-4 border rounded hover:bg-gray-50 transition" > <p className="text-sm text-gray-500">← Previous</p> <h4 className="font-semibold"> {previousNews.news_title} </h4> </Link> )} {nextNews && ( <Link href={`/news/${nextNews.slug}`} className="p-4 border rounded hover:bg-gray-50 transition text-right" > <p className="text-sm text-gray-500">Next →</p> <h4 className="font-semibold"> {nextNews.news_title} </h4> </Link> )} </div>
            <RelatedNews relatedNews={relatedNews} />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-6 no-print">
              <LatestNews news={latestNews} />
              <MostViewedNews mostViewedNews={mostViewedNews} />
            </div>
          </div>

        </div>
      </div>
    </FrontendLayout>
  )
}