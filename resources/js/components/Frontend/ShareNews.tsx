"use client";

import { FaFacebookF, FaXTwitter, FaWhatsapp, FaFacebookMessenger, FaLink } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import toast from "react-hot-toast";

interface Props {
    title: string;
    url: string;
}

export default function ShareNews({ title, url }: Props) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,

        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,

        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,

        telegram:
`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
    };

    const popup = (link: string) => {
        window.open(
            link,
            "_blank",
            "width=650,height=550"
        );
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success("লিংক কপি হয়েছে");
        } catch {
            toast.error("লিংক কপি করা যায়নি");
        }
    };

    return (
        <div className="mt-10 border bg-white p-5">

            <div className="flex flex-wrap items-center gap-3">

                <span className="font-semibold text-gray-700">
                    শেয়ার করুন: 
                </span>

                <button
                    onClick={() => popup(shareLinks.facebook)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white transition hover:scale-105"
                >
                    <FaFacebookF />
                </button>

                <button
                    onClick={() => popup(shareLinks.twitter)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition hover:scale-105"
                >
                    <FaXTwitter />
                </button>

                <button
                    onClick={() => popup(shareLinks.whatsapp)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white transition hover:scale-105"
                >
                    <FaWhatsapp />
                </button>

                <button
                    onClick={() => popup(shareLinks.telegram)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white transition hover:scale-105"
                >
                    <FaTelegramPlane />
                </button>

                <button
                    onClick={copyLink}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-700 text-white transition hover:scale-105"
                >
                    <FaLink />
                </button>

            </div>
        </div>
    );
}