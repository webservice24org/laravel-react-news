import FrontendLayout from "@/layouts/frontend-layout"
import LatestNews from "@/components/Frontend/Sidebar/LatestNews"
import { usePage, Link, router } from "@inertiajs/react"
import SeoHead from "@/components/SeoHead"

interface PageProps {
  page: {
    title: string
    content: string
    thumbnail?: string
    layout: "default" | "sidebar-left" | "sidebar-right"
  }

  latestNews: {
    id: number
    news_title: string
    slug: string
    news_thumbnail?: string
    created_at: string
  }[]
}



export default function Page({ page, latestNews }: PageProps) {

    const layout = page.layout ?? "default"    
    const siteUrl =
    typeof window !== "undefined" ? window.location.origin : ""
    const { seo } = usePage().props as any;
    const currentUrl =
    typeof window !== "undefined" ? window.location.href : ""


    const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title,
    url: currentUrl,
  }

   const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "হোম",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.title,
        item: currentUrl,
      },
    ],
  }

  return (
    <FrontendLayout>

      <SeoHead seo={seo} page={page} />
{/* PAGE HEADER / HERO */}
<div className="bg-gray-100 border-b">
  <div className="max-w-7xl mx-auto px-4 py-10 text-center">
    <h1 className="text-4xl font-bold text-gray-800">
      {page.title}
    </h1>
  </div>
</div>


<div className="max-w-7xl mx-auto px-4 py-10">

  {/* DEFAULT FULL WIDTH */}
  {layout === "default" && (
    <div className="max-w-4xl mx-auto">

      {page.thumbnail && (
        <img
          src={`/storage/${page.thumbnail}`}
          className="w-full rounded mb-6"
        />
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />

    </div>
  )}


  {/* SIDEBAR LEFT */}
  {layout === "sidebar-left" && (
    <div className="grid grid-cols-12 gap-8">

      {/* LEFT SIDEBAR */}
      <aside className="col-span-12 lg:col-span-3">
        <div className="bg-gray-100 p-5 rounded">
          <LatestNews news={latestNews} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="col-span-12 lg:col-span-9">

        {page.thumbnail && (
          <img
            src={`/storage/${page.thumbnail}`}
            className="w-full rounded mb-6"
          />
        )}

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

      </main>

    </div>
  )}


  {/* SIDEBAR RIGHT */}
  {layout === "sidebar-right" && (
    <div className="grid grid-cols-12 gap-8">

      {/* MAIN CONTENT */}
      <main className="col-span-12 lg:col-span-9">

        {page.thumbnail && (
          <img
            src={`/storage/${page.thumbnail}`}
            className="w-full rounded mb-6"
          />
        )}

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="col-span-12 lg:col-span-3">
        <div className="bg-gray-100 p-5 rounded">
          Sidebar Right
        </div>
      </aside>

    </div>
  )}

</div>
    </FrontendLayout>
  );
}