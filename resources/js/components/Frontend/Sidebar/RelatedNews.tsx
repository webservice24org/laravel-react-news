interface NewsItem {
    id: number;
    news_title: string;
    slug: string;
    news_thumbnail?: string;
    created_at: string;
}

export default function RelatedNews({ relatedNews }: { relatedNews: NewsItem[] }) {
    if (!relatedNews.length) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow mt-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">
                Related News
            </h3>

            <div className="grid grid-cols-3 gap-4">
                {relatedNews.map((news) => (
                    <a key={news.id} href={`/news/${news.slug}`}>
                        <img
                            src={`/storage/${news.news_thumbnail}`}
                            className="w-full h-32 object-cover rounded"
                        />
                        <h4 className="text-sm font-semibold mt-2 line-clamp-2">
                            {news.news_title}
                        </h4>
                    </a>
                ))}
            </div>
        </div>
    );
}