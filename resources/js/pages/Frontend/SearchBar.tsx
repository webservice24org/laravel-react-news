"use client";

import { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchSuggestions from "@/pages/Frontend/SearchSuggestions";
declare function route(name: string, params?: any): string

interface NewsItem {
    title: string;
    slug: string;
    image: string;
}

export default function SearchBar() {
    const [searchOpen, setSearchOpen] =useState(false);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<NewsItem[]>([]);

    const wrapperRef = useRef<HTMLDivElement>(null);

    /**
     * Submit Search
     */
    const submitSearch = () => {
        if (!search.trim()) return;

        router.get(route("search"), {
            q: search,
        });

        setSearchOpen(false);
    };

    /**
     * Live Suggestions
     */
    useEffect(() => {
        if (search.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    route("search.suggestions", {
                        q: search,
                    })
                );

                const data = await response.json();

                setSuggestions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    /**
     * Close dropdown when clicking outside
     */
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setSuggestions([]);
                setSearchOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            {/* Search Toggle */}

            <button
                type="button"
                onClick={() => setSearchOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-red-50 hover:text-red-600"
            >
                {searchOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Search className="h-5 w-5" />
                )}
            </button>

            {/* Search Panel */}

            <div
                className={`absolute right-0 top-12 w-162.5 rounded-xl border bg-white shadow-2xl transition-all duration-300 ${
                    searchOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                }`}
            >
                <div className="p-4">

                    <div className="flex gap-3">

                        <Input
                            autoFocus={searchOpen}
                            value={search}
                            placeholder="Search news..."
                            className="h-11"
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    submitSearch();
                                }
                            }}
                        />

                        <button
                            onClick={submitSearch}
                            className="rounded-md bg-red-600 px-6 text-white transition hover:bg-red-700"
                        >
                            Search
                        </button>

                    </div>

                    <SearchSuggestions
                        loading={loading}
                        search={search}
                        suggestions={suggestions}
                        onViewAll={submitSearch}
                        onSelect={() => {
                            setSearch("");
                            setSuggestions([]);
                            setSearchOpen(false);
                        }}
                    />

                </div>
            </div>
        </div>
    );
}