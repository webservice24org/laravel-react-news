import type { InertiaLinkProps } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { toUrl } from "@/lib/utils";

export function useActiveUrl() {
    const page = usePage();

    const currentUrl = new URL(page.url, window.location.origin).pathname;

    function urlIsActive(
        urlToCheck: NonNullable<InertiaLinkProps["href"]>,
        current?: string
    ) {
        const currentPath = current ?? currentUrl;
        const target = toUrl(urlToCheck);

        return (
            currentPath === target ||
            currentPath.startsWith(target + "/")
        );
    }

    return {
        currentUrl,
        urlIsActive,
    };
}