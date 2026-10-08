"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Helper function to format dynamic Bengali date
function getFormattedBanglaDate() {
  const date = new Date();

  const toBanglaDigits = (str) =>
    str.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

  const days = [
    "রোববার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];

  const months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];

  const dayName = days[date.getDay()];
  const dayNum = toBanglaDigits(date.getDate().toString());
  const monthName = months[date.getMonth()];
  const yearNum = toBanglaDigits(date.getFullYear().toString());

  return `${dayName}, ${dayNum} ${monthName}, ${yearNum}`;
}

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();
  const formattedDate = getFormattedBanglaDate();

  const handleSeeAllProducts = () => {
    if (!session) {
      toast.error("সব পণ্য দেখতে অনুগ্রহ করে আগে সাইন ইন করুন");
      router.push("/signin");
    } else {
      // If logged in, scroll smoothly to products section
      const productsElem = document.getElementById("products-section");
      if (productsElem) {
        productsElem.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("#products-section");
      }
    }
  };

  return (
    <section className="bg-[#f6faf7] my-6 max-w-7xl mx-auto rounded-3xl p-8 md:p-12 border border-emerald-50/50 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Text Content */}
        <div className="flex-1 space-y-4 text-left">
          {/* Dynamic Date Tag */}
          <div className="inline-block bg-[#e8f5ed] text-[#009645] text-xs font-semibold px-4 py-1.5 rounded-full">
            {formattedDate}
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleSeeAllProducts}
              className="bg-[#009645] hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition duration-200 shadow-sm active:scale-95"
            >
              সব পণ্য দেখুন
            </button>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <img
              src="/bazar-hero.png"
              alt="Bazar Hero"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}