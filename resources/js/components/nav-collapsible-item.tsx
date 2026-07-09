"use client";

import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";

import { NavItem } from "@/types";
import { useActiveUrl } from "@/hooks/use-active-url";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

interface Props {
    item: NavItem;
}

export default function NavCollapsibleItem({ item }: Props) {
    const { urlIsActive } = useActiveUrl();

    const childActive =
        item.items?.some((child) => urlIsActive(child.href)) ?? false;

    const [open, setOpen] = useState(childActive);

    // Automatically open when visiting a child route
    useEffect(() => {
        if (childActive) {
            setOpen(true);
        }
    }, [childActive]);

    return (
        <Collapsible
            open={open}
            onOpenChange={(value) => {
                // Prevent closing while on an active child page
                if (childActive && !value) return;

                setOpen(value);
            }}
            className="group/collapsible"
        >
            <SidebarMenuItem>

                {/* Parent */}
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={{ children: item.title }}
                        className={`
                            w-full transition-all duration-200
                            ${
                                childActive
                                    ? "bg-red-100 dark:bg-red-900/40 text-red-600 border-l-4 border-red-600 font-semibold shadow-sm"
                                    : "hover:bg-muted"
                            }
                        `}
                    >
                        {item.icon && (
                            <item.icon className="h-4 w-4 shrink-0" />
                        )}

                        <span className="flex-1 text-left">
                            {item.title}
                        </span>

                        <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${
                                open ? "rotate-90" : ""
                            }`}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* Children */}
                <CollapsibleContent>

                    <div className="ml-5 mt-2 border-l-2 border-red-200 dark:border-red-900 pl-3 space-y-1">

                        {item.items?.map((child) => {
                            const active = urlIsActive(child.href);

                            return (
                                <SidebarMenuButton
                                    key={child.title}
                                    asChild
                                    isActive={active}
                                    className={`
                                        w-full justify-start rounded-md transition-all duration-200
                                        ${
                                            active
                                                ? "bg-red-100 dark:bg-red-900/40 text-red-600 font-semibold border-l-4 border-red-600 shadow-sm"
                                                : "hover:bg-muted"
                                        }
                                    `}
                                >
                                    <Link
                                        href={child.href}
                                        prefetch
                                        className="flex w-full items-center gap-2"
                                    >
                                        {child.icon && (
                                            <child.icon className="h-4 w-4 shrink-0" />
                                        )}

                                        <span>{child.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            );
                        })}

                    </div>

                </CollapsibleContent>

            </SidebarMenuItem>
        </Collapsible>
    );
}