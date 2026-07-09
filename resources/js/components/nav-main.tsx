"use client";

import { Link } from "@inertiajs/react";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useActiveUrl } from "@/hooks/use-active-url";

import { NavItem } from "@/types";

import NavCollapsibleItem from "./nav-collapsible-item";

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { urlIsActive } = useActiveUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>

            <SidebarMenu>

                {items.map((item) => {

                    if (item.items?.length) {
                        return (
                            <NavCollapsibleItem
                                key={item.title}
                                item={item}
                            />
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>

                            <SidebarMenuButton
                                asChild
                                isActive={urlIsActive(item.href!)}
                                tooltip={{ children: item.title }}
                                className={
                                    urlIsActive(item.href!)
                                        ? "bg-red-50 dark:bg-red-950 border-l-4 border-red-600 text-red-600 font-semibold"
                                        : ""
                                }
                            >
                                <Link
                                    href={item.href!}
                                    prefetch
                                >
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}

                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>

                        </SidebarMenuItem>
                    );
                })}

            </SidebarMenu>
        </SidebarGroup>
    );
}