import { Head, usePage } from "@inertiajs/react";

interface SeoHeadProps {
    seo?: any;

    news?: any;
    category?: any;
    subCategory?: any;
    tag?: any;
    page?: any;
    authorPage?: any;

    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;

    type?: "website" | "article";

    author?: string;
    publishedTime?: string;
    modifiedTime?: string;

    robots?: string;

    children?: React.ReactNode;
}

export default function SeoHead({
    news,
    category,
    subCategory,
    tag,
    page,
    authorPage,

    title,
    description,
    keywords,
    image,
    url,

    type = "website",

    author,
    publishedTime,
    modifiedTime,

    robots,

    children,
}: SeoHeadProps) {
    const { seo } = usePage().props as any;

    const origin =
        typeof window !== "undefined"
            ? window.location.origin
            : "";

    const currentUrl =
        url ??
        (typeof window !== "undefined"
            ? window.location.href
            : "");

    const makeImage = (img?: string | null) => {
        if (!img) return undefined;

        if (
            img.startsWith("http://") ||
            img.startsWith("https://")
        ) {
            return img;
        }

        return `${origin}/storage/${img}`;
    };

    const stripHtml = (html?: string) => {
        if (!html) return "";

        return html
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim();
    };

    /*
    |--------------------------------------------------------------------------
    | Global Defaults
    |--------------------------------------------------------------------------
    */

    let pageTitle =
        title ??
        seo?.meta_title ??
        seo?.site_name ??
        "";

    let pageDescription =
        description ??
        seo?.meta_description ??
        "";

    let pageKeywords =
        keywords ??
        seo?.meta_keywords ??
        "";

    let pageImage =
        image
            ? makeImage(image)
            : makeImage(
                  seo?.og_image ??
                  seo?.twitter_image
              );

    let pageType = type;

    /*
    |--------------------------------------------------------------------------
    | HOME PAGE
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | SINGLE NEWS
    |--------------------------------------------------------------------------
    */

    if (news) {

        pageTitle =
            news.meta_title ||
            news.news_title ||
            seo.meta_title ||
            seo.site_name;

        pageDescription =
            news.meta_description ||
            news.hanger_title ||
            stripHtml(news.news_description).substring(0, 160);

        pageKeywords =
        news.meta_keywords?.trim()
        || seo?.meta_keywords?.trim()
        || "";

        pageImage =
            makeImage(news.news_thumbnail);

        pageType = "article";
    }

    /*
    |--------------------------------------------------------------------------
    | CATEGORY
    |--------------------------------------------------------------------------
    */

    if (category) {

        pageTitle =
            `${category.name} | ${seo.site_name}`;

        pageDescription =
            `${category.name} সম্পর্কিত সর্বশেষ সংবাদ, প্রতিবেদন ও আপডেট।`;

        pageType = "website";
    }

    /*
    |--------------------------------------------------------------------------
    | SUB CATEGORY
    |--------------------------------------------------------------------------
    */

    if (subCategory) {

        pageTitle =
            `${subCategory.name} | ${seo.site_name}`;

        pageDescription =
            `${subCategory.name} সম্পর্কিত সর্বশেষ সংবাদ।`;

        pageType = "website";
    }

    /*
    |--------------------------------------------------------------------------
    | TAG
    |--------------------------------------------------------------------------
    */

    if (tag) {

        pageTitle =
            `${tag.name} | ${seo.site_name}`;

        pageDescription =
            `${tag.name} ট্যাগের সকল সংবাদ।`;

        pageType = "website";
    }

    /*
    |--------------------------------------------------------------------------
    | AUTHOR
    |--------------------------------------------------------------------------
    */

    if (authorPage) {

        pageTitle =
            `${authorPage.name} | ${seo.site_name}`;

        pageDescription =
            authorPage.profile?.about ||
            `${authorPage.name} এর প্রকাশিত সংবাদসমূহ`;

        if (authorPage.profile?.profile_photo) {

            pageImage =
                makeImage(authorPage.profile.profile_photo);
        }

        pageType = "website";
    }

    /*
    |--------------------------------------------------------------------------
    | STATIC PAGE
    |--------------------------------------------------------------------------
    */

    if (page) {

        pageTitle =
            page.meta_title ||
            page.title;

        pageDescription =
            page.meta_description ||
            page.title;

        pageKeywords =
            page.meta_keywords ||
            pageKeywords;

        pageType = "website";
    }

    /*
    |--------------------------------------------------------------------------
    | Robots
    |--------------------------------------------------------------------------
    */

    const robotsContent =
        robots ??
        (
            seo?.index_site
                ? "index,follow"
                : "noindex,nofollow"
        );

    return (

        <Head>

            <title>{pageTitle}</title>

            <meta
                name="description"
                content={pageDescription}
            />

            {pageKeywords && (

                <meta
                    name="keywords"
                    content={pageKeywords}
                />

            )}

            <meta
                name="robots"
                content={robotsContent}
            />

            <link
                rel="canonical"
                href={currentUrl}
            />

            {/* Google */}

            {seo?.google_verification_code && (

                <meta
                    name="google-site-verification"
                    content={seo.google_verification_code}
                />

            )}

            {/* Bing */}

            {seo?.bing_verification_code && (

                <meta
                    name="msvalidate.01"
                    content={seo.bing_verification_code}
                />

            )}

            {/* Open Graph */}

            <meta
                property="og:type"
                content={pageType}
            />

            <meta
                property="og:site_name"
                content={seo?.site_name || "BazarZatkaran"}
            />

            <meta
                property="og:title"
                content={pageTitle}
            />

            <meta
                property="og:description"
                content={pageDescription}
            />

            <meta
                property="og:url"
                content={currentUrl}
            />

            {pageImage && (

                <meta
                    property="og:image"
                    content={pageImage}
                />

            )}

            {/* Twitter */}

            <meta
                name="twitter:card"
                content="summary_large_image"
            />

            <meta
                name="twitter:title"
                content={pageTitle}
            />

            <meta
                name="twitter:description"
                content={pageDescription}
            />

            {pageImage && (

                <meta
                    name="twitter:image"
                    content={pageImage}
                />

            )}

            {/* Article */}

            {pageType === "article" && author && (

                <meta
                    property="article:author"
                    content={author}
                />

            )}
            

            {pageType === "article" && publishedTime && (

                <meta
                    property="article:published_time"
                    content={publishedTime}
                />

            )}

            {pageType === "article" && modifiedTime && (

                <meta
                    property="article:modified_time"
                    content={modifiedTime}
                />

            )}

            {children}

        </Head>

    );
}