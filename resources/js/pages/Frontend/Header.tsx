import React, { useState } from "react"
import { Link, usePage } from "@inertiajs/react"


type Menu = {
  id: number
  title: string
  url: string
  parent_id: number | null
  children_recursive?: Menu[]
}

type PageProps = {
  menus: Menu[]
}

export default function FrontendHeader() {
  const { menus } = usePage<PageProps>().props
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logos } = usePage().props as any;
  const headerLogo = logos?.header;
  return (
    <header className="relative z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <nav className="flex items-center justify-between py-4">
          <div className="text-xl font-bold">
            <Link href="/">
            {headerLogo ? (
              <img
                src={headerLogo.path}
                alt={headerLogo.alt ?? "Logo"}
                className="h-10"
              />
            ) : (
              <span className="font-bold text-xl">My Site</span>
            )}
          </Link>
          </div>

          <button
            type="button"
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
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

          <ul className="hidden items-center gap-2 md:flex">
            {menus.map((menu) => (
              <DesktopMenuItem key={menu.id} menu={menu} />
            ))}
          </ul>
        </nav>

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            mobileOpen ? "max-h-250 pb-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="space-y-1 border-t pt-3">
            {menus.map((menu) => (
              <MobileMenuItem key={menu.id} menu={menu} />
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}

function DesktopMenuItem({ menu }: { menu: Menu }) {
  const hasChildren = !!menu.children_recursive?.length

  return (
    <li className="group relative">
      <Link
        href={menu.url ?? "#"}
        className="inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
      >
        {menu.title}
        {hasChildren && (
          <svg
            className="h-4 w-4 transition group-hover:rotate-180"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.512a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </Link>

      {hasChildren && (
        <ul className="invisible absolute left-0 top-full z-50 mt-2 min-w-55 translate-y-2 rounded-lg border bg-white p-1 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          {menu.children_recursive!.map((child) => (
            <DesktopSubMenuItem key={child.id} menu={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

function DesktopSubMenuItem({ menu }: { menu: Menu }) {
  const hasChildren = !!menu.children_recursive?.length

  return (
    <li className="group/sub relative">
      <Link
        href={menu.url ?? "#"}
        className="flex items-center justify-between rounded-md px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
      >
        <span>{menu.title}</span>
        {hasChildren && (
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.512 4.25a.75.75 0 0 1 0 1.08l-4.512 4.25a.75.75 0 0 1-1.06-.02Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </Link>

      {hasChildren && (
        <ul className="invisible absolute left-full top-0 ml-2 min-w-55 translate-x-2 rounded-lg border bg-white p-1 opacity-0 shadow-lg transition-all duration-200 group-hover/sub:visible group-hover/sub:translate-x-0 group-hover/sub:opacity-100">
          {menu.children_recursive!.map((child) => (
            <DesktopSubMenuItem key={child.id} menu={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

function MobileMenuItem({ menu, level = 0 }: { menu: Menu; level?: number }) {
  const [open, setOpen] = useState(false)
  const hasChildren = !!menu.children_recursive?.length

  return (
    <li>
      <div
        className="flex items-center justify-between rounded-md hover:bg-gray-50"
        style={{ paddingLeft: `${level * 16}px` }}
      >
        <Link
          href={menu.url ?? "#"}
          className="flex-1 px-4 py-3 text-sm font-medium text-gray-700"
        >
          {menu.title}
        </Link>

        {hasChildren && (
          <button
            type="button"
            className="px-4 py-3 text-gray-500"
            onClick={() => setOpen((prev) => !prev)}
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.512a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {hasChildren && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            open ? "max-h-250 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="ml-2 border-l border-gray-200">
            {menu.children_recursive!.map((child) => (
              <MobileMenuItem key={child.id} menu={child} level={level + 1} />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}