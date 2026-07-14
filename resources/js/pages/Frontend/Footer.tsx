"use client"

import {Link, usePage } from "@inertiajs/react"
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaPinterestP, FaWhatsapp } from "react-icons/fa";
import "react-day-picker/dist/style.css";
import {
    MapPin,
    Phone,
    Smartphone,
    Mail
} from "lucide-react";
import ArchiveDatePicker from "@/components/Frontend/ArchiveDatePicker";





export default function FrontendFooter() {
  const { logos } = usePage().props as any;
  const { socials } = usePage().props as any;
  const { officeInfo } = usePage().props as any;
  const { pages } = usePage().props as any;
  const { seo } = usePage().props as any;
  

  const footerLogo = logos?.footer;
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">

      {/* Top Footer */}
      <div className="mx-auto max-w-7xl px-4 py-10">

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">

          {/* ================= Logo ================= */}
          <div className="lg:col-span-3">

            <Link href="/">
                {footerLogo ? (
                    <img
                        src={footerLogo.path}
                        alt={footerLogo.alt ?? "Logo"}
                        className="h-12"
                    />
                ) : (
                    <span className="text-2xl font-bold">
                        {seo?.site_name}
                    </span>
                )}
            </Link>

            <p className="mt-5 text-sm leading-7 text-gray-600">

                {officeInfo?.editor_title && (
                    <span className="font-semibold">
                        {officeInfo.editor_title}
                    </span>
                )}

                {officeInfo?.editor_name && (
                    <>
                        <br />
                        <span>{officeInfo.editor_name}</span>
                    </>
                )}

            </p>

        </div>

          {/* ================= Contact ================= */}

          <div className="lg:col-span-3">

            <h3 className="mb-5 text-lg font-bold">
                Contact
            </h3>

            <div className="space-y-3 text-sm text-gray-600">

                {officeInfo?.office_address && (
                    <div className="flex gap-2">
                        <MapPin className="mt-1 h-4 w-4 text-red-600"/>
                        <span>{officeInfo.office_address}</span>
                    </div>
                )}

                {officeInfo?.phone && (
                    <div className="flex gap-2">
                        <Phone className="h-4 w-4 text-red-600"/>
                        <span>{officeInfo.phone}</span>
                    </div>
                )}

                {officeInfo?.mobile && (
                    <div className="flex gap-2">
                        <Smartphone className="h-4 w-4 text-red-600"/>
                        <span>{officeInfo.mobile}</span>
                    </div>
                )}

                {officeInfo?.email && (
                    <div className="flex gap-2">
                        <Mail className="h-4 w-4 text-red-600"/>
                        <span>{officeInfo.email}</span>
                    </div>
                )}

            </div>

        </div>

          {/* ================= Pages ================= */}

          <div className="lg:col-span-2">

            <h3 className="mb-5 text-lg font-bold">
                Quick Links
            </h3>

            <ul className="space-y-3">

                {pages?.map((page:any)=>(
                    <li key={page.id}>

                        <Link
                            href={`/pages/${page.slug}`}
                            className="text-sm text-gray-600 transition hover:pl-2 hover:text-red-600"
                        >
                            {page.title}
                        </Link>

                    </li>
                ))}

            </ul>

        </div>

          {/* ================= Archive ================= */}

          <div className="lg:col-span-4">

            <h3 className="mb-5 text-lg font-bold">
                News Archive
            </h3>

            <div className="rounded-xl border bg-gray-50 p-4">

                <ArchiveDatePicker />

                <p className="mt-4 text-sm text-gray-500 leading-6">
                    Browse all published news by selecting a date from the archive.
                </p>

          </div>

        </div>



        </div>

      </div>

      {/* ================= Bottom Footer ================= */}

      <div className="border-t">

    <div className="mx-auto max-w-7xl px-4 py-5">

        <div className="flex flex-col items-center gap-5 lg:flex-row lg:justify-between">

            <div className="text-sm text-gray-600">

                © {new Date().getFullYear()}{" "}
                {seo?.copyright_credit || "বাজারজাতকরণ কর্তৃক সর্বস্বত্ব স্বত্বাধিকার সংরক্ষিত"}

            </div>

            <div className="flex flex-wrap justify-center gap-3">

                {/* All social icons here */}

                    
              <div className="flex flex-wrap gap-3">

                  {socials?.facebook && (
                    <a
                      href={socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-300 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <FaFacebookF size={16} />
                    </a>
                  )}

                  {socials?.twitter && (
                    <a
                      href={socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-300 hover:border-sky-500 hover:bg-sky-500 hover:text-white"
                    >
                      <FaTwitter size={16} />
                    </a>
                  )}

                  {socials?.instagram && (
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-300 hover:border-pink-500 hover:bg-pink-500 hover:text-white"
                    >
                      <FaInstagram size={16} />
                    </a>
                  )}

                  {socials?.youtube && (
                    <a
                      href={socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-300 hover:border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <FaYoutube size={16} />
                    </a>
                  )}

                  {socials?.tiktok && (
                    <a
                      href={socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
                    >
                      <FaTiktok size={16} />
                    </a>
                  )}

                  {socials?.pinterest && (
                    <a
                      href={socials.pinterest}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Pinterest"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-300 hover:border-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <FaPinterestP size={16} />
                    </a>
                  )}

                  {socials?.whatsapp && (
                    <a
                      href={socials.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-300 hover:border-green-500 hover:bg-green-500 hover:text-white"
                    >
                      <FaWhatsapp size={16} />
                    </a>
                  )}

                </div>
            </div>

            <div className="text-sm text-gray-600">

                Developed by

                <a
                    href="https://webservicebd.org"
                    target="_blank"
                    className="ml-1 font-semibold text-red-600 hover:underline"
                >
                    MicroWeb Technology
                </a>

            </div>

        </div>

    </div>

</div>

    </footer>
  )
}

