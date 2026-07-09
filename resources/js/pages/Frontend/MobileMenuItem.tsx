
import React, {useEffect, useState } from "react"
import { Link, usePage } from "@inertiajs/react"
import Header from "@/layouts/frontend-layout";
import type { Menu, HeaderPageProps } from "./types";
export function MobileMenuItem({ menu, level = 0 }: { menu: Menu; level?: number }) {
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