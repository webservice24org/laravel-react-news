"use client"

import {Link, usePage } from "@inertiajs/react"
import React from "react"
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaPinterestP, FaWhatsapp } from "react-icons/fa";



export default function FrontendFooter() {
  const { logos } = usePage().props as any;
  const { socials } = usePage().props as any;

  const footerLogo = logos?.footer;
  return (
    <footer className="mt-10 border-t bg-white">
      {/* Top footer */}
        <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-4 gap-8">
        {/* Col 1 */}
        <div>
            <div className="text-base font-semibold">
              <Link href="/">
            {footerLogo ? (
              <img
                src={footerLogo.path}
                alt={footerLogo.alt ?? "Logo"}
                className="h-10"
              />
            ) : (
              <span className="font-bold text-xl">My Site</span>
            )}
          </Link>
            </div>
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



<div className="flex gap-3 text-lg">

  {socials?.facebook && (
    <a href={socials.facebook} target="_blank" className="hover:text-blue-600">
      <FaFacebookF />
    </a>
  )}

  {socials?.twitter && (
    <a href={socials.twitter} target="_blank" className="hover:text-sky-500">
      <FaTwitter />
    </a>
  )}

  {socials?.instagram && (
    <a href={socials.instagram} target="_blank" className="hover:text-pink-500">
      <FaInstagram />
    </a>
  )}

  {socials?.youtube && (
    <a href={socials.youtube} target="_blank" className="hover:text-red-600">
      <FaYoutube />
    </a>
  )}

  {socials?.tiktok && (
    <a href={socials.tiktok} target="_blank">
      <FaTiktok />
    </a>
  )}

  {socials?.pinterest && (
    <a href={socials.pinterest} target="_blank" className="hover:text-red-500">
      <FaPinterestP />
    </a>
  )}

  {socials?.whatsapp && (
    <a href={socials.whatsapp} target="_blank" className="hover:text-green-500">
      <FaWhatsapp />
    </a>
  )}

</div>
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


