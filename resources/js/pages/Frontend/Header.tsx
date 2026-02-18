"use client"

import React from "react"
import { Link } from "@inertiajs/react"

declare function route(name: string, params?: any): string

export default function FrontendHeader() {
  return (
    <header className="bg-white border-b">
      <div className="mx-auto max-w-7xl px-4">
        {/* Top row: Logo + extras */}
        <div className="flex items-center justify-between py-3">
          <Link href={route("home")} className="flex items-center gap-2">
            {/* Replace with your logo image later */}
            <div className="h-9 w-9 rounded bg-neutral-900" />
            <div className="leading-tight">
              <div className="text-lg font-bold">Mzamin Clone</div>
              <div className="text-xs text-neutral-500">News Portal</div>
            </div>
          </Link>

          {/* Right side (later: date, language, social, login) */}
          <div className="text-sm text-neutral-500">Bangladesh</div>
        </div>

        {/* Bottom row: Menu */}
        <nav className="flex flex-wrap items-center gap-3 py-2 text-sm">
          <NavItem href={route("home")} label="Home" />
          <NavItem href="#" label="National" />
          <NavItem href="#" label="Politics" />
          <NavItem href="#" label="Sports" />
          <NavItem href="#" label="Entertainment" />
          <NavItem href="#" label="International" />
          <NavItem href="#" label="Technology" />
          <NavItem href="#" label="Lifestyle" />
        </nav>
      </div>
    </header>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="px-3 py-2 rounded hover:bg-neutral-100 transition">
      {label}
    </Link>
  )
}
