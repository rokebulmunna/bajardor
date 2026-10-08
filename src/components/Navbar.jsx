"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";

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

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const formattedDate = getFormattedBanglaDate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("https://api.abcz.workers.dev/api/bazardor/categories");
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

    async function fetchProducts() {
      try {
        const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products");
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }

    fetchCategories();
    fetchProducts();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
  };

  const toBanglaDigits = (num) => {
    if (num === null || num === undefined) return "০";
    return num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  return (
    <header className="bg-[#fafafa] border-b border-gray-200">
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#009645] rounded-2xl flex items-center justify-center text-white text-xl shadow-sm">
            🛒
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
              বাজার দর
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {formattedDate}
            </p>
          </div>
        </Link>

        {session ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            >
              <img
                src={session.user?.image || "https://i.ibb.co/mR4qB1L/user.png"}
                alt="Profile"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span className="font-medium text-gray-800 text-sm">
                {session.user?.name || "User"}
              </span>
              <span className="text-xs text-gray-500">▼</span>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu z-[1] p-2 shadow-lg bg-white rounded-xl w-48 border border-gray-100 mt-2"
            >
              <li>
                <Link href="/profile">মাই প্রোফাইল</Link>
              </li>
              <li>
                <button onClick={handleSignOut} className="text-red-600">
                  সাইন আউট
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#009645] transition"
            >
              সাইন ইন
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium bg-[#009645] hover:bg-emerald-700 text-white rounded-lg transition"
            >
              সাইন আপ
            </Link>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100" />

      {/* Middle Dynamic Categories Row */}
      <div className="max-w-7xl mx-auto px-6 py-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-center gap-6 min-w-max">
          {categories.length > 0 ? (
            categories.map((cat) => {
              const catSlug = cat.slug || cat.id;
              const isActive = pathname === `/category/${catSlug}`;
              return (
                <Link
                  key={cat.id || cat.slug}
                  href={`/category/${catSlug}`}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#009645] font-bold"
                      : "text-gray-700 hover:text-[#009645]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })
          ) : (
            <div className="text-xs text-gray-400 py-1">ক্যাটাগরি লোড হচ্ছে...</div>
          )}
        </div>
      </div>

      {/* Bottom Scrolling Price Ticker */}
      <div className="bg-[#f0f7f3] border-t border-gray-200 py-2 overflow-hidden whitespace-nowrap text-xs">
        {products.length > 0 ? (
          <div className="inline-flex animate-marquee space-x-6">
            {[...products, ...products].map((item, index) => {
              const name = item.nameBn || "পণ্য";
              const priceVal = item.today ?? 0;
              const unitVal = item.unit || "কেজি";
              const pctVal = item.change?.pct ?? 0;
              const isUp = item.change?.dir === "up";
              const iconVal = item.categoryIcon || "🍚";

              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-4 border-r border-gray-200 shrink-0"
                >
                  <span>{iconVal}</span>
                  <span className="font-semibold text-gray-800">{name}</span>
                  <span className="text-gray-600">
                    {toBanglaDigits(priceVal)} টাকা/{unitVal}
                  </span>
                  <span
                    className={`font-bold flex items-center gap-0.5 ${
                      isUp ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {isUp ? "▲" : "▼"} {toBanglaDigits(pctVal.toString())}%
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-0.5">
            লোডিং বাজার দর...
          </div>
        )}
      </div>
    </header>
  );
}