import FrontendLayout from "@/layouts/frontend-layout"
import LatestNews from "@/components/Frontend/Sidebar/LatestNews"
import { Head, Link, router } from "@inertiajs/react"
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

    const currentUrl =
    typeof window !== "undefined" ? window.location.href : ""

  const metaTitle = `${page.title} | আপনার নিউজ পোর্টাল`
  const metaDescription = `${page.title} সম্পর্কিত সর্বশেষ আপডেট, ব্রেকিং নিউজ এবং গুরুত্বপূর্ণ প্রতিবেদন পড়ুন।`

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

      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={currentUrl} />

        {/* OpenGraph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={currentUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Head>
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