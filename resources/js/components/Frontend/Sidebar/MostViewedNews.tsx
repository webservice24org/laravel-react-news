interface NewsItem {
    id: number;
    news_title: string;
    slug: string;
    news_thumbnail?: string;
    created_at?: string;
    view_count?: number;
}

export default function MostViewedNews({ mostViewedNews }: { mostViewedNews: NewsItem[] }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">
                Most Viewed
            </h3>

            {mostViewedNews.map((news) => (
                <a
                    key={news.id}
                    href={`/news/${news.slug}`}
                    className="flex gap-3 mb-4 hover:bg-gray-50 p-2 rounded transition"
                >
                    <img
                        src={`/storage/${news.news_thumbnail}`}
                        className="w-20 h-16 object-cover rounded"
                    />

                    <div>
                        <h4 className="text-sm font-semibold line-clamp-2">
                            {news.news_title}
                        </h4>
                        <p className="text-xs text-gray-500">
                            {news.view_count} views
                        </p>
                    </div>
                </a>
            ))}
        </div>
    );
}