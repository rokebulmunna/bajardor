"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Runtime Error:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#f2f5f3] flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xs max-w-md w-full space-y-5">
        <div className="text-5xl">⚠️</div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            কিছু একটা সমস্যা হয়েছে!
          </h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            ডাটা লোড করতে বা পেজ রেন্ডার করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition text-sm cursor-pointer"
          >
            আবার চেষ্টা করুন
          </button>
          
          <Link
            href="/"
            className="flex-1 bg-[#009645] hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition text-sm shadow-xs"
          >
            হোম পেজ
          </Link>
        </div>
      </div>
    </div>
  );
}