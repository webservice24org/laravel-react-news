"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function GoTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollTop}
            aria-label="Go to top"
            title="Back to Top"
            className={`
                group fixed bottom-6 right-6 z-50
                flex h-13 w-13 items-center justify-center
                rounded-full
                bg-gradient-to-r from-red-600 to-red-700
                text-white
                shadow-2xl
                transition-all duration-300
                hover:-translate-y-1 hover:scale-110
                hover:shadow-red-500/40
                active:scale-95
                ${
                    visible
                        ? "opacity-100"
                        : "pointer-events-none opacity-0 translate-y-5"
                }
            `}
        >
            <FaArrowUp className="text-base animate-pulse" />
        </button>
    );
}