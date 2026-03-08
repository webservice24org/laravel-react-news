"use client"

import FrontendFooter from "@/pages/Frontend/Footer"
import FrontendHeader from "@/pages/Frontend/Header"
import { usePage } from "@inertiajs/react"
import React from "react"


export default function FrontendLayout({ children }: { children: React.ReactNode }) {

  const { menus } = usePage().props as any
  
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
       <FrontendHeader menus={menus} />
      {children}

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>

      <FrontendFooter />
    </div>
  )
}
