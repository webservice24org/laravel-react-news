declare function route(
  name: string,
  params?: any
): string
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Projector, BookText, BookAudio, BrickWall, Tag  } from 'lucide-react'; // added Users icon

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
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'User Management', // updated title
        href: route('admin.users.index'), // use Inertia route helper
        icon: Users, // new icon for users
    },
    {
        title: 'Categories',
        href: route('admin.categories.index'),
        icon: Folder,
    },
    {
        title: 'Sub Categories',
        href: route('admin.subcategories.index'),
        icon: Projector,
    },
    {
        title: 'Divisions',
        href: route('admin.divisions.index'),
        icon: BookOpen,
    },
    {
        title: 'Districts',
        href: route('admin.districts.index'),
        icon: BookText,
    },
    {
        title: 'Upazilas',
        href: route('admin.upazilas.index'),
        icon: BookAudio,
    },
    {
        title: 'Unions',
        href: route('admin.unions.index'),
        icon: BrickWall,
    },
    {
        title: 'Tags',
        href: route('admin.tags.index'),
        icon: Tag,
    },
    {
        title: 'News Posts',
        href: route('admin.news-posts.index'),
        icon: LayoutGrid,
    },
    {
        title: 'Author Analytics',
        href: route('admin.authors.analytics'),
        icon: Users,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
