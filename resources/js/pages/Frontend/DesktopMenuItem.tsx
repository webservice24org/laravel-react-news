import React, {useEffect, useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import type { Menu, HeaderPageProps } from "./types";

export function DesktopMenuItem({ menu }: { menu: Menu }) {
  const hasChildren = !!menu.children_recursive?.length

  return (
    <li className="group relative">
      <Link
        href={menu.url ?? "#"}
        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
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
