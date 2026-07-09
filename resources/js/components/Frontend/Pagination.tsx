import { Link } from "@inertiajs/react";

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className="mt-10 flex justify-center">
            <div className="flex flex-wrap items-center gap-2">

                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || "#"}
                        preserveScroll
                        dangerouslySetInnerHTML={{
                            __html: link.label,
                        }}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-4 text-sm transition
                            ${
                                link.active
                                    ? "border-red-600 bg-red-600 text-white"
                                    : link.url
                                    ? "bg-white hover:bg-red-50 hover:text-red-600"
                                    : "cursor-not-allowed bg-gray-100 text-gray-400"
                            }
                        `}
                    />
                ))}

            </div>
        </div>
    );
}