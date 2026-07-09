import FrontendLayout from "@/layouts/frontend-layout";
import { Head, Link } from "@inertiajs/react";
import Pagination from "@/components/Frontend/Pagination";
import LatestNews from "@/components/Frontend/Sidebar/LatestNews"
import MostViewedNews from "@/components/Frontend/Sidebar/MostViewedNews"



export default function Search({ news, search, latestNews, mostViewedNews }: any) {

    return (
        <FrontendLayout>

            <Head title={`Search: ${search}`} />

            <div className="max-w-7xl mx-auto py-8 px-4">

                <h1 className="text-3xl font-bold mb-6">
                    Search Results
                </h1>

                <p className="mb-6 text-gray-500">
                    {news.total} results found for "{search}"
                </p>
                <div className="grid grid-cols-12 gap-6">
                     {/* LEFT CONTENT */}
                    <div className="col-span-12 lg:col-span-9">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {news.data.map((item: any) => (

                                <Link
                                    href={`/news/${item.slug}`}
                                    key={item.id}
                                    className="rounded-lg border overflow-hidden hover:shadow-lg"
                                >

                                    <img
                                        src={
                                            item.news_thumbnail
                                                ? `/storage/${item.news_thumbnail}`
                                                : "/images/fallback-news.jpg"
                                        }
                                        className="w-full h-52 object-cover"
                                    />

                                    <div className="p-4">

                                        <h2 className="font-semibold">
                                            {item.news_title}
                                        </h2>

                                    </div>

                                </Link>

                            ))}

                        </div>
                        <Pagination links={news.links} />
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="col-span-12 lg:col-span-3">
                    <div className="space-y-6">
                        <LatestNews news={latestNews} />
                        <MostViewedNews mostViewedNews={mostViewedNews} />
                    </div>
                    </div>
                </div>

                

            </div>

        </FrontendLayout>
    );
}