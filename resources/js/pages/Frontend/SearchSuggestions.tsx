"use client";

import { Link } from "@inertiajs/react";

export interface NewsSuggestion {
    title: string;
    slug: string;
    image: string;
}

interface Props {
    loading: boolean;
    search: string;
    suggestions: NewsSuggestion[];
    onViewAll: () => void;
    onSelect?: () => void;
}

export default function SearchSuggestions({
    loading,
    search,
    suggestions,
    onViewAll,
    onSelect,
}: Props) {
    if (loading) {
        return (
            <div className="mt-4 flex justify-center py-6">
                <svg
                    className="h-6 w-6 animate-spin text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-20"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />

                    <path
                        className="opacity-80"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
            </div>
        );
    }

    if (search.length >= 2 && suggestions.length === 0) {
        return (
            <div className="mt-4 rounded-lg border bg-white py-8 text-center text-sm text-gray-500">
                No news found.
            </div>
        );
    }

    if (suggestions.length === 0) return null;

    return (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

            {suggestions.map((item) => (
                <Link
                    key={item.slug}
                    href={`/news/${item.slug}`}
                    onClick={onSelect}
                    className="flex items-center gap-4 border-b p-3 transition hover:bg-red-50 last:border-b-0"
                >
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-24 rounded-md object-cover"
                    />

                    <div className="flex-1">

                        <h4 className="line-clamp-2 text-sm font-medium text-gray-800">
                            {item.title}
                        </h4>

                    </div>
                </Link>
            ))}

            <button
                onClick={onViewAll}
                className="w-full border-t bg-gray-50 py-3 text-center text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
                View all search results →
            </button>
        </div>
    );
}