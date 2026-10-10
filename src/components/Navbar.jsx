"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";

function getFormattedBanglaDate() {
  const date = new Date();

  const toBanglaDigits = (str) => str.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

  const days = ["রোববার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

  return `${days[date.getDay()]}, ${toBanglaDigits(date.getDate().toString())} ${months[date.getMonth()]}, ${toBanglaDigits(date.getFullYear().toString())}`;
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const formattedDate = getFormattedBanglaDate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ড্রেপডাউনের বাইরে ক্লিক করলে তা নিজে থেকেই বন্ধ হয়ে যাবে
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const catRes = await fetch("https://openapi.programming-hero.com/api/bazardor").catch(() => null);
        if (catRes && catRes.ok) {
          const catData = await catRes.json();
          if (isMounted && Array.isArray(catData) && catData.length > 0) {
            setCategories(catData);
          }
        } else if (isMounted) {
          setCategories([
            { id: "1", slug: "rice", nameBn: "চাল", icon: "🍚" },
            { id: "2", slug: "lentil", nameBn: "ডাল", icon: "🫘" },
            { id: "3", slug: "oil", nameBn: "তেল", icon: "🛢️" },
            { id: "4", slug: "vegetable", nameBn: "সবজি", icon: "🥦" },
            { id: "5", slug: "fish", nameBn: "মাছ", icon: "🐟" },
            { id: "6", slug: "meat", nameBn: "মাংস", icon: "🥩" },
          ]);
        }

        const prodRes = await fetch("https://openapi.programming-hero.com/api/bazardor").catch(() => null);
        if (prodRes && prodRes.ok) {
          const prodData = await prodRes.json();
          if (isMounted && Array.isArray(prodData) && prodData.length > 0) {
            setProducts(prodData);
          }
        } else if (isMounted) {
          setProducts([
            { nameBn: "নাজিরশাইল চাল", today: 78, unit: "কেজি", change: { dir: "up", pct: 2.1 }, categoryIcon: "🍚" },
            { nameBn: "মসুর ডাল", today: 140, unit: "কেজি", change: { dir: "down", pct: 1.5 }, categoryIcon: "🫘" },
            { nameBn: "সরিষার তেল", today: 190, unit: "লিটার", change: { dir: "up", pct: 0.8 }, categoryIcon: "🛢️" },
            { nameBn: "দেশি আলু", today: 35, unit: "কেজি", change: { dir: "down", pct: 5.0 }, categoryIcon: "🥔" },
            { nameBn: "দেশি পেঁয়াজ", today: 65, unit: "কেজি", change: { dir: "up", pct: 3.2 }, categoryIcon: "🧅" },
          ]);
        }
      } catch (err) {
        console.warn("Using local fallback data for navbar:", err);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    setIsMenuOpen(false);
    await signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
  };

  const toBanglaDigits = (num) => {
    if (num === null || num === undefined) return "০";
    return num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  return (
    <header className="bg-[#fafafa] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 relative flex items-center justify-center">
            <Image src="/logo-icon.png" alt="BazarDor Logo" width={48} height={48} className="object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">বাজার দর</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">{formattedDate}</p>
          </div>
        </Link>

        {session ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition focus:outline-none"
            >
              <img
                src={
                  session.user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    session.user?.name || "User"
                  )}&background=009645&color=fff`
                }
                alt="Profile"
                className="w-10 h-10 rounded-xl object-cover border border-gray-200"
              />
              <span className="font-medium text-gray-800 text-sm">{session.user?.name || "User"}</span>
              <span className="text-xs text-gray-500">{isMenuOpen ? "▲" : "▼"}</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 space-y-2">
                {/* ১. নাম ও ইমেইল হেডার */}
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {session.user?.name || "ইউজার"}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {session.user?.email || "user@example.com"}
                  </p>
                </div>

                {/* ২. আমার প্রোফাইল লিংক */}
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition"
                >
                  <span>👤</span>
                  <span>আমার প্রোফাইল</span>
                </Link>

                {/* ৩. সাইন আউট বাটন */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl font-semibold transition cursor-pointer"
                >
                  <span>↵</span>
                  <span>সাইন আউট</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/signin" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#009645] transition">
              সাইন ইন
            </Link>
            <Link href="/signup" className="px-4 py-2 text-sm font-medium bg-[#009645] hover:bg-emerald-700 text-white rounded-lg transition">
              সাইন আপ
            </Link>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100" />

      <div className="max-w-7xl mx-auto px-6 py-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-center gap-6 min-w-max">
          {categories.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/category/${cat.slug || cat.id}`}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                pathname === `/category/${cat.slug || cat.id}` ? "text-[#009645] font-bold" : "text-gray-700 hover:text-[#009645]"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.nameBn}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-[#f0f7f3] border-t border-gray-200 py-2 overflow-hidden whitespace-nowrap text-xs">
        <div className="inline-flex animate-marquee space-x-6">
          {[...products, ...products].map((item, index) => (
            <div key={index} className="inline-flex items-center gap-2 px-4 border-r border-gray-200 shrink-0">
              <span>{item.categoryIcon || "🍚"}</span>
              <span className="font-semibold text-gray-800">{item.nameBn}</span>
              <span className="text-gray-600">{toBanglaDigits(item.today)} টাকা/{item.unit}</span>
              <span className={`font-bold flex items-center gap-0.5 ${item.change?.dir === "up" ? "text-red-500" : "text-green-600"}`}>
                {item.change?.dir === "up" ? "▲" : "▼"} {toBanglaDigits(item.change?.pct || 0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}