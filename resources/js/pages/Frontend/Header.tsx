import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

import { DesktopMenuItem } from "@/pages/Frontend/DesktopMenuItem";
import { MobileMenuItem } from "@/pages/Frontend/MobileMenuItem"
import SearchBar from "@/pages/Frontend/SearchBar"


type Menu = {
    id: number;
    title: string;
    url: string;
    parent_id: number | null;
    children_recursive?: Menu[];
};

type PageProps = {
    menus: Menu[];
};

export default function FrontendHeader() {
    const { menus } = usePage<PageProps>().props;
    const { logos } = usePage().props as any;

    const headerLogo = logos?.header;

    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="relative z-50 border-b bg-white shadow-sm">

            <div className="mx-auto max-w-7xl px-4">

                <nav className="flex items-center justify-between py-4">

                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        {headerLogo ? (
                            <img
                                src={headerLogo.path}
                                alt={headerLogo.alt ?? "Logo"}
                                className="h-10"
                            />
                        ) : (
                            <span className="text-xl font-bold">
                                My Site
                            </span>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">

                        <ul className="flex items-center gap-0.5">

                            {menus.map((menu) => (
                                <DesktopMenuItem
                                    key={menu.id}
                                    menu={menu}
                                />
                            ))}

                        </ul>

                        <SearchBar />

                    </div>

                    {/* Mobile Menu Button */}

                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="inline-flex items-center rounded-md border px-3 py-2 md:hidden"
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            {mobileOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                </nav>

                {/* Mobile Navigation */}

                <div
                    className={`overflow-hidden transition-all duration-300 md:hidden ${
                        mobileOpen
                            ? "max-h-200 pb-4 opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >

                    <ul className="space-y-1 border-t pt-3">

                        {menus.map((menu) => (
                            <MobileMenuItem
                                key={menu.id}
                                menu={menu}
                            />
                        ))}

                    </ul>

                </div>

            </div>

        </header>
    );
}