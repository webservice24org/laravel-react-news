import FrontendLayout from "@/layouts/frontend-layout";
import { usePage, Link } from "@inertiajs/react";

import LatestNews from "@/components/Frontend/Sidebar/LatestNews";
import MostViewedNews from "@/components/Frontend/Sidebar/MostViewedNews";
import Pagination from "@/components/Frontend/Pagination";
import SeoHead from "@/components/SeoHead";

interface ArchiveProps {
    date: string;
    news: any;
    latestNews: any[];
    mostViewedNews: any[];
}

export default function Show({
    date,
    news,
    latestNews,
    mostViewedNews,
}: ArchiveProps) {

    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const { seo } = usePage().props as any;

    return (
        <FrontendLayout>

            <SeoHead
                seo={seo}
                title={`Archive - ${date}`}
                description={`News archive for ${date}`}
            />

            <div className="mx-auto max-w-7xl px-4 py-8">

                {/* Page Header */}

                <div className="mb-8 border-b pb-5">

                    <h1 className="text-3xl font-bold text-gray-900">
                        আর্কাইভ - {formattedDate}
                    </h1>


                    <p className="mt-1 text-sm text-gray-500">
                        {news.total} news found
                    </p>

                </div>

                <div className="grid grid-cols-12 gap-8">

                    {/* Left */}

                    <div className="col-span-12 lg:col-span-9">

                        {news.data.length > 0 ? (

                            <>
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                                    {news.data.map((item: any) => (

                                        <Link
                                            key={item.id}
                                            href={`/news/${item.slug}`}
                                            className="overflow-hidden rounded-xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                        >

                                            <img
                                                src={
                                                    item.news_thumbnail
                                                        ? `/storage/${item.news_thumbnail}`
                                                        : "/images/fallback-news.jpg"
                                                }
                                                alt={item.news_title}
                                                className="h-52 w-full object-cover"
                                            />

                                            <div className="p-4">

                                                {item.categories?.length > 0 && (
                                                    <span className="mb-3 inline-block rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                                                        {item.categories[0].name}
                                                    </span>
                                                )}

                                                <h2 className="line-clamp-2 text-lg font-bold leading-7 text-gray-900">
                                                    {item.news_title}
                                                </h2>

                                                <p className="mt-3 text-sm text-gray-500">
                                                    {new Date(
                                                        item.published_at ??
                                                            item.created_at
                                                    ).toLocaleDateString()}
                                                </p>

                                            </div>

                                        </Link>

                                    ))}

                                </div>

                                <div className="mt-10">

                                    <Pagination links={news.links} />

                                </div>

                            </>

                        ) : (

                            <div className="rounded-xl border bg-white py-20 text-center">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mx-auto h-20 w-20 text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 12h6m-6 4h6M7 8h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                                    />
                                </svg>

                                <h2 className="mt-6 text-2xl font-bold text-gray-700">
                                    No News Found
                                </h2>

                                <p className="mt-3 text-gray-500">
                                    No news was published on this date.
                                </p>

                            </div>

                        )}

                    </div>

                    {/* Sidebar */}

                    <div className="col-span-12 lg:col-span-3">

                        <div className="space-y-6">

                            <LatestNews news={latestNews} />

                            <MostViewedNews
                                mostViewedNews={mostViewedNews}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </FrontendLayout>
    );
}