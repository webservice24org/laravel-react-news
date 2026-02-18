"use client"

import React from "react"

export default function FrontendFooter() {
  return (
    <footer className="mt-10 border-t bg-white">
      {/* Top footer */}
        <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-4 gap-8">
        {/* Col 1 */}
        <div>
            <div className="text-base font-semibold">About</div>
            <p className="mt-2 text-sm text-neutral-600">
            This is the frontend layout. Later we’ll build mzamin.com style sections,
            category pages, and details pages.
            </p>
        </div>

        {/* Col 2 */}
        <div>
            <div className="text-base font-semibold">Sections</div>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li><a href="#" className="hover:text-neutral-900">National</a></li>
            <li><a href="#" className="hover:text-neutral-900">Politics</a></li>
            <li><a href="#" className="hover:text-neutral-900">Sports</a></li>
            <li><a href="#" className="hover:text-neutral-900">Entertainment</a></li>
            <li><a href="#" className="hover:text-neutral-900">International</a></li>
            </ul>
        </div>

        {/* Col 3 */}
        <div>
            <div className="text-base font-semibold">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li><a href="#" className="hover:text-neutral-900">About Us</a></li>
            <li><a href="#" className="hover:text-neutral-900">Contact</a></li>
            <li><a href="#" className="hover:text-neutral-900">Advertise</a></li>
            <li><a href="#" className="hover:text-neutral-900">Privacy Policy</a></li>
            </ul>
        </div>

        {/* Col 4 */}
        <div>
            <div className="text-base font-semibold">Social</div>
            <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li><a href="#" className="hover:text-neutral-900">Facebook</a></li>
            <li><a href="#" className="hover:text-neutral-900">YouTube</a></li>
            <li><a href="#" className="hover:text-neutral-900">Twitter/X</a></li>
            <li><a href="#" className="hover:text-neutral-900">Instagram</a></li>
            </ul>
        </div>
        </div>



      {/* Bottom footer */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-neutral-600">
            © {new Date().getFullYear()} Mzamin Clone. All rights reserved.
          </div>
          <div className="text-sm text-neutral-500">Developed with Laravel + Inertia + React</div>
        </div>
      </div>
    </footer>
  )
}


