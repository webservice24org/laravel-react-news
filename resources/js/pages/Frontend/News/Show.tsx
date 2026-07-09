"use client"

import React from "react"
import { Head, Link, usePage } from "@inertiajs/react"
import FrontendLayout from "@/layouts/frontend-layout"
import LatestNews from "@/components/Frontend/Sidebar/LatestNews"
import RelatedNews from "@/components/Frontend/Sidebar/RelatedNews"
import MostViewedNews from "@/components/Frontend/Sidebar/MostViewedNews"
import toast from "react-hot-toast"
import { getExcerpt } from "@/utils/text";
import { formatBanglaDateTime } from "@/utils/date";

declare function route(name: string, params?: any): string

interface Category {
  id: number
  name: string
  slug: string
}

export interface Author {
  id: number
  name: string

  profile?: {
    profile_photo?: string | null
  } | null
}
interface Tag {
    id: number
    name: string
    slug: string
}

interface NewsPost {
  id: number
  top_title?: string
  news_title: string
  hanger_title?: string
  slug: string
  news_description: string
  news_thumbnail?: string
  thumbnail_caption?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  published_at: string
  updated_at?: string
  view_count: number
  categories: Category[]
  tags?: Tag[]
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


const { seo, frontendSettings, advertisements } = usePage().props as any;

const category = news.categories?.[0];

const settings = frontendSettings;

const currentUrl = seo?.url;
const siteUrl = seo?.site_url;

const imageUrl = news.news_thumbnail
    ? `${siteUrl}/storage/${news.news_thumbnail}`
    : `${siteUrl}/images/fallback-news.jpg`;

const description =
    news.meta_description ||
    getExcerpt(news.news_description, 35);

const title =
    news.meta_title ||
    news.news_title;

const publishedDate = new Date(news.published_at).toISOString();

const updatedDate = new Date(
    news.updated_at ?? news.published_at
).toISOString();

const singlePageBelowArticle = advertisements?.find(
    (ad: any) => ad.ad_name === "Single Page Below Article"
);

const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",

    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": currentUrl,
    },

    headline: news.news_title,

    description,

    image: [
        imageUrl,
    ],

    datePublished: publishedDate,

    dateModified: updatedDate,

    author: {
        "@type": "Person",
        name: news.author?.name ?? "নিজস্ব প্রতিবেদক",

        ...(news.author?.profile?.profile_photo && {
            image: `${siteUrl}/storage/${news.author.profile.profile_photo}`,
        }),
    },

    publisher: {
        "@type": "Organization",

        name: settings.website_name,

        logo: {
            "@type": "ImageObject",

            url:
                settings.logo ??
                `${siteUrl}/logo.png`,
        },
    },
};

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(currentUrl)
        toast.success("লিংক কপি হয়েছে!")
    } catch {
        toast.error("লিংক কপি করা যায়নি!")
    }
}

const archiveDate = new Date(news.published_at)
    .toISOString()
    .split("T")[0];

  return (
    <FrontendLayout>
      <Head>
    {/* ===========================
        Basic SEO
    ============================ */}

    <title>{title}</title>

    <meta
        name="description"
        content={description}
    />

    <meta
        name="keywords"
        content={news.meta_keywords || ""}
    />

    <meta
        name="author"
        content={news.author?.name || "নিজস্ব প্রতিবেদক"}
    />

    <meta
        name="robots"
        content="index,follow,max-image-preview:large"
    />

    <link
        rel="canonical"
        href={currentUrl}
    />

    {/* ===========================
        Open Graph (Facebook)
    ============================ */}

    <meta
        property="og:locale"
        content="bn_BD"
    />

    <meta
        property="og:type"
        content="article"
    />

    <meta
        property="og:site_name"
        content={settings.website_name}
    />

    <meta
        property="og:title"
        content={title}
    />

    <meta
        property="og:description"
        content={description}
    />

    <meta
        property="og:url"
        content={currentUrl}
    />

    <meta
        property="og:image"
        content={imageUrl}
    />

    <meta
        property="og:image:secure_url"
        content={imageUrl}
    />

    <meta
        property="og:image:alt"
        content={news.news_title}
    />

    <meta
        property="og:image:type"
        content="image/webp"
    />

    <meta
        property="og:image:width"
        content="1200"
    />

    <meta
        property="og:image:height"
        content="630"
    />

    {/* ===========================
        Article
    ============================ */}

    <meta
        property="article:published_time"
        content={publishedDate}
    />

    <meta
        property="article:modified_time"
        content={updatedDate}
    />

    <meta
        property="article:author"
        content={news.author?.name || ""}
    />

    {category && (
        <meta
            property="article:section"
            content={category.name}
        />
    )}

    {news.tags?.map((tag: any) => (
        <meta
            key={tag.id}
            property="article:tag"
            content={tag.name}
        />
    ))}

    {/* ===========================
        Twitter / X
    ============================ */}

    <meta
        name="twitter:card"
        content="summary_large_image"
    />

    <meta
        name="twitter:title"
        content={title}
    />

    <meta
        name="twitter:description"
        content={description}
    />

    <meta
        name="twitter:image"
        content={imageUrl}
    />

    <meta
        name="twitter:image:alt"
        content={news.news_title}
    />

    <meta
        name="twitter:url"
        content={currentUrl}
    />

    {/* ===========================
        Mobile
    ============================ */}

    <meta
        name="theme-color"
        content="#dc2626"
    />

    <meta
        name="apple-mobile-web-app-capable"
        content="yes"
    />

    <meta
        name="apple-mobile-web-app-status-bar-style"
        content="default"
    />

    {/* ===========================
        AMP
    ============================ */}

    <link
        rel="amphtml"
        href={`${siteUrl}/amp/news/${news.slug}`}
    />

    {/* ===========================
        JSON-LD
    ============================ */}

    <script
        type="application/ld+json"
    >
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
                <strong>লেখক:</strong>

                {news.author ? (
                  <Link
                    href={route("author.show", news.author.id)}
                    className="mt-2 flex items-center gap-2 rounded-lg bg-white p-1 border hover:bg-gray-50 transition"
                  >
                    <img
                      src={
                        news.author.profile?.profile_photo
                          ? `/storage/${news.author.profile.profile_photo}`
                          : "/images/avatar-placeholder.png"
                      }
                      alt={news.author.name}
                      className="h-12 w-12 rounded-full object-cover border"
                    />

                    <div>
                      <div className="font-medium text-gray-900">
                        {news.author.name}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src="/images/avatar-placeholder.png"
                      alt="নিজস্ব প্রতিবেদক"
                      className="h-12 w-12 rounded-full object-cover border"
                    />

                    <span>নিজস্ব প্রতিবেদক</span>
                  </div>
                )}
              </div>

              <div>
                <strong>ভিউ:</strong>{news.view_count}
              </div>

              <div>
                  <strong className="text-gray-900">
                      প্রকাশের তারিখ:
                  </strong>
                  <Link
                    href={route("archive.show", {
                        date: archiveDate,
                    })}
                    className="mt-1 block text-blue-600 hover:underline"
                >
                    {formatBanglaDateTime(news.published_at)}
                </Link>
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

            <div className="mb-6">

              {news.top_title && (
                  <p className="mb-3 text-sm font-bold uppercase tracking-wider text-red-600">
                      {news.top_title}
                  </p>
              )}

              <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
                  {news.news_title}
              </h1>

              {news.hanger_title && (
                  <p className="mt-5 border-l-4 border-red-600 pl-4 text-lg italic leading-8 text-gray-600 md:text-xl">
                      {news.hanger_title}
                  </p>
              )}

          </div>

            {news.news_thumbnail && (
              <div className="mb-6">
                <img
                  src={`/storage/${news.news_thumbnail}`}
                  alt={news.news_title}
                  className="w-full max-h-125 object-contain rounded bg-gray-100"
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
            {/* Previous / Next */} <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-10"> {previousNews && ( <Link href={`/news/${previousNews.slug}`} className="p-4 border rounded hover:bg-gray-50 transition" > <p className="text-sm text-gray-500">← {frontendSettings.previous_news_text || "Previous"}</p> <h4 className="font-semibold"> {previousNews.news_title} </h4> </Link> )} {nextNews && ( <Link href={`/news/${nextNews.slug}`} className="p-4 border rounded hover:bg-gray-50 transition text-right" > <p className="text-sm text-gray-500">{frontendSettings.next_news_text || "Next"} →</p> <h4 className="font-semibold"> {nextNews.news_title} </h4> </Link> )} </div>
            <RelatedNews relatedNews={relatedNews} />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-6 no-print">
              <LatestNews news={latestNews} />
              <MostViewedNews mostViewedNews={mostViewedNews} />
            </div>
          </div>

            <div className="col-span-12 mt-6">
              {singlePageBelowArticle ? (
                  singlePageBelowArticle.ad_code ? (
                      <div
                          className="overflow-hidden rounded-lg"
                          dangerouslySetInnerHTML={{
                              __html: singlePageBelowArticle.ad_code,
                          }}
                      />
                  ) : (
                      <a
                          href={singlePageBelowArticle.ad_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition"
                      >
                          <img
                              src={singlePageBelowArticle.ad_image}
                              alt={singlePageBelowArticle.ad_name}
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
    </FrontendLayout>
  )
}