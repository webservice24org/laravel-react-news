declare function route(
  name: string,
  params?: any
): string
import { Link } from '@inertiajs/react';
import { FilePlus, Megaphone, ChartColumnDecreasing,ChartNoAxesCombined,ChartNetwork, Settings, RadioTower, Mails, Wrench, SquareMenu, MapPinCheckInside, MapPinCheck, MapPinHouse, UserRoundPlus, ChartColumnStacked, UserRound, BookOpen, Folder, LayoutGrid, Users, Projector, BookText, BookAudio, BrickWall, Tag, Mail, Image, BetweenHorizontalStart   } from 'lucide-react'; // added Users icon

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';

import AppLogo from './app-logo';

 

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboard(),
        icon: LayoutGrid,
    },

    {
        title: "User Management",
        icon: Users,
        items: [
            {
                title: "Users",
                icon: UserRoundPlus,
                href: route("admin.users.index"),
            },
            {
                title: "Author Analytics",
                icon: UserRound,
                href: route("admin.authors.analytics"),
            },
        ],
    },

    {
        title: "News Management",
        icon: BookText,
        items: [
            {
                title: "News Posts",
                icon: LayoutGrid,
                href: route("admin.news-posts.index"),
            },
            {
                title: "Add News Post",
                icon: FilePlus,
                href: route("admin.news-posts.create"),
            },
            {
                title: "Categories",
                icon: ChartColumnStacked ,
                href: route("admin.categories.index"),
            },
            {
                title: "Sub Categories",
                icon: ChartColumnDecreasing ,
                href: route("admin.subcategories.index"),
            },
            {
                title: "Tags",
                icon: Tag,
                href: route("admin.tags.index"),
            },
        ],
    },

    {
        title: "Location Management",
        icon: BrickWall,
        items: [
            {
                title: "Divisions",
                icon: MapPinHouse,
                href: route("admin.divisions.index"),
            },
            {
                title: "Districts",
                icon: MapPinCheckInside,
                href: route("admin.districts.index"),
            },
            {
                title: "Upazilas",
                icon: MapPinCheck,
                href: route("admin.upazilas.index"),
            },
            {
                title: "Unions",
                icon: MapPinHouse,
                href: route("admin.unions.index"),
            },
        ],
    },

    {
        title: "Frontend Settings",
        icon: Settings,
        items: [
            {
                title: "Menu Management",
                icon: SquareMenu,
                href: route("admin.menus"),
            },
            {
                title: "Logo Settings",
                icon: Image,
                href: route("admin.logos.index"),
            },
            {
                title: "Website Settings",
                icon: Wrench,
                href: route("admin.settings.index"),
            },
            {
                title: "Frontend Settings",
                icon: Wrench,
                href: route("admin.frontend-settings.edit"),
            },
            {
                title: "Fallback Image",
                icon: Image,
                href: route("admin.fallback-image.index"),
            },
        ],
    },

    {
        title: "Communication",
        icon: Mail,
        items: [
            {
                title: "Mail Configuration",
                icon: Mails,
                href: route("admin.mail-config.index"),
            },
            {
                title: "Social Connections",
                icon: RadioTower,
                href: route("admin.social-connections.index"),
            },
        ],
    },

    {
        title: "Analytics",
        icon: LayoutGrid,
        items: [
            {
                title: "Analytics Configuration",
                icon: ChartNetwork ,
                href: route("admin.analytics-config.index"),
            },
            {
                title: "Analytics Dashboard",
                icon: ChartNoAxesCombined,
                href: route("admin.analytics.dashboard"),
            },
            {
                title: "Pro Analytics",
                icon: ChartNetwork,
                href: route("admin.pro.analytics.dashboard"),
            },
        ],
    },

    {
        title: "Advertisements",
        icon: Megaphone,
        href: route("admin.advertisements.index"),
    },

    {
        title: "Office Information",
        icon: BookAudio,
        href: route("admin.office-info.index"),
    },
];



export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
