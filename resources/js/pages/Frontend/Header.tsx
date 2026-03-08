"use client"

import React from "react"
import { Link } from "@inertiajs/react"

declare function route(name: string, params?: any): string

interface Menu {
  id: number
  title: string
  url?: string
  childrenRecursive?: Menu[]
}

export default function FrontendHeader({ menus }: { menus: Menu[] }) {

  return (
    <header className="bg-white border-b">

      <div className="mx-auto max-w-7xl px-4">

        {/* Top row */}
        <div className="flex items-center justify-between py-3">

          <Link href={route("home")} className="flex items-center gap-2">

            <div className="h-9 w-9 rounded bg-neutral-900" />

            <div className="leading-tight">
              <div className="text-lg font-bold">Mzamin Clone</div>
              <div className="text-xs text-neutral-500">News Portal</div>
            </div>

          </Link>

          <div className="text-sm text-neutral-500">Bangladesh</div>

        </div>


        {/* Bottom row menu */}
        <nav className="flex items-center gap-3 py-2 text-sm">

          <NavItem href={route("home")} label="Home" />

          {menus.map(menu => (
            <MenuDropdown key={menu.id} menu={menu} />
          ))}

        </nav>

      </div>

    </header>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded hover:bg-neutral-100 transition"
    >
      {label}
    </Link>
  )
}

function MenuDropdown({ menu }: { menu: any }) {

  const hasChildren = menu.childrenRecursive && menu.childrenRecursive.length > 0

  if (!hasChildren) {
    return <NavItem href={menu.url || "#"} label={menu.title} />
  }

  return (

    <div className="relative group">

      <Link
        href={menu.url || "#"}
        className="px-3 py-2 rounded hover:bg-neutral-100 flex items-center gap-1"
      >
        {menu.title}
      </Link>

      {/* Dropdown */}
      <div className="absolute left-0 hidden group-hover:block bg-white shadow-lg border mt-1 min-w-45 z-50">

        {menu.childrenRecursive.map((child: any) => (

          <Link
            key={child.id}
            href={child.url || "#"}
            className="block px-4 py-2 hover:bg-neutral-100 text-sm"
          >
            {child.title}
          </Link>

        ))}

      </div>

    </div>

  )

}