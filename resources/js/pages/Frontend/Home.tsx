"use client"

import React from "react"
import { Head } from "@inertiajs/react"
import FrontendLayout from "@/layouts/frontend-layout"

export default function Home() {
  return (
    <FrontendLayout>
      <Head title="Home" />

      {/* Placeholder Body Sections (we will replace step-by-step) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main area */}
        <section className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border bg-white p-5">
            <div className="text-lg font-semibold">Lead Section (Coming Next)</div>
            <div className="text-sm text-neutral-600 mt-1">
              Here we’ll show: Lead news + sub-lead + grid like mzamin.com.
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="text-lg font-semibold">Category Blocks (Coming Next)</div>
            <div className="text-sm text-neutral-600 mt-1">
              We will add multiple sections: National, Politics, Sports, etc.
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border bg-white p-5">
            <div className="text-lg font-semibold">Sidebar (Coming Next)</div>
            <div className="text-sm text-neutral-600 mt-1">
              Latest news list, Popular news, Ads, etc.
            </div>
          </div>
        </aside>
      </div>
    </FrontendLayout>
  )
}
