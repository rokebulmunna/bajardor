"use client";

import { use, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { slug } = params;

  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const toBanglaDigits = (num) => {
    if (num === null || num === undefined) return "০";
    return num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  // Protected Route Check
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  // Fetch single product by id or slug
  useEffect(() => {
    async function fetchProductDetails() {
      setLoading(true);
      setError(false);
      try {
        // ১. চেষ্টা করবে আইডি দিয়ে সিঙ্গল প্রোডাক্টের API কল করার
        let res = await fetch(`https://api.abcz.workers.dev/api/bazardor/products/${slug}`);
        
        if (res.ok) {
          const data = await res.json();
          if (data && (data.nameBn || data.name)) {
            setProduct(data);
            return;
          }
        }

        // ২. যদি ID দিয়ে ম্যাচ না করে, সব প্রোডাক্ট এনে ফিল্টার করা
        res = await fetch("https://api.abcz.workers.dev/api/bazardor/products");
        if (res.ok) {
          const allProducts = await res.json();
          if (Array.isArray(allProducts)) {
            const cleanSlug = decodeURIComponent(slug).toLowerCase();
            const found = allProducts.find(
              (p) => String(p.id) === cleanSlug || (p.slug && p.slug.toLowerCase() === cleanSlug)
            );
            if (found) {
              setProduct(found);
              return;
            }
          }
        }

        setError(true);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
  }, [slug]);

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 font-medium text-sm">
        তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (!session) return null;

  if (error || !product) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-[#f2f5f3] flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs max-w-md w-full space-y-4">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900">পণ্যের তথ্য পাওয়া যায়নি!</h2>
          <p className="text-xs text-gray-500 font-medium">
            API থেকে ডাটা লোড করতে সমস্যা হচ্ছে অথবা পণ্যটি বিদ্যমান নেই।
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-[#009645] hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition text-sm shadow-xs"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const todayVal = product.today || product.todayPrice || 100;

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#f2f5f3] py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-gray-800">হোম</Link>
          <span>›</span>
          <Link href={`/category/${product.categorySlug || "rice"}`} className="hover:text-gray-800">
            {product.categoryName || product.category || "ক্যাটাগরি"}
          </Link>
          <span>›</span>
          <span className="text-gray-800 font-semibold">{product.nameBn || product.name}</span>
        </div>

        {/* Top Summary Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl shrink-0 border border-gray-100">
              {product.categoryIcon || product.icon || "📦"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {product.nameBn || product.name}
              </h1>
              <p className="text-xs text-gray-500 font-semibold mt-1">
                {product.unit || "প্রতি কেজি"} · {product.categoryName || product.category || "সাধারণ"}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">
                {product.priceChangeText || "গতকালকের তুলনায় আজ দর পরিবর্তন"}
              </p>
            </div>
          </div>

          {/* Today's Price Badge */}
          <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-4 text-center min-w-[150px] self-stretch md:self-auto flex flex-col items-center justify-center">
            <p className="text-[11px] text-gray-400 font-bold">আজকের দাম</p>
            <p className="text-3xl font-black text-gray-900 mt-1">
              {toBanglaDigits(todayVal)}
            </p>
            <p className="text-[10px] text-gray-400 font-medium">টাকা / {product.unit?.replace("প্রতি ", "") || "কেজি"}</p>
            <span className="text-xs font-bold text-red-500 mt-1">
              ▲ {toBanglaDigits(product.changePct || product.change?.pct || 0)}%
            </span>
          </div>
        </div>

        {/* দামের সারসংক্ষেপ */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-900 px-1">
            দামের সারসংক্ষেপ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100">
              <p className="text-xs text-gray-400 font-semibold">সর্বনিম্ন দাম</p>
              <p className="text-2xl font-black text-[#009645] mt-1">
                {toBanglaDigits(product.minPrice || Math.round(todayVal * 0.9))} <span className="text-xs font-normal">টাকা</span>
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-1">
                {product.minBazar || "সর্বনিম্ন দামের বাজার"}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100">
              <p className="text-xs text-gray-400 font-semibold">সর্বোচ্চ দাম</p>
              <p className="text-2xl font-black text-red-500 mt-1">
                {toBanglaDigits(product.maxPrice || Math.round(todayVal * 1.1))} <span className="text-xs font-normal">টাকা</span>
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-1">
                {product.maxBazar || "সর্বোচ্চ দামের বাজার"}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100">
              <p className="text-xs text-gray-400 font-semibold">গড় দাম</p>
              <p className="text-2xl font-black text-[#009645] mt-1">
                {toBanglaDigits(product.avgPrice || todayVal)} <span className="text-xs font-normal">টাকা</span>
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-1">
                {product.avgBazar || "গড় বাজার দর"}
              </p>
            </div>

          </div>
        </div>

        {/* বাজারভিত্তিক আজকের দাম Table */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400">
                  <th className="py-3 px-2 font-medium">বাজার</th>
                  <th className="py-3 px-2 font-medium">বিভাগ</th>
                  <th className="py-3 px-2 text-right font-medium">সর্বনিম্ন</th>
                  <th className="py-3 px-2 text-right font-medium">সর্বোচ্চ</th>
                  <th className="py-3 px-2 text-right font-medium">গড়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {(product.bazarList && product.bazarList.length > 0
                  ? product.bazarList
                  : [
                      { name: "কারওয়ান বাজার", division: "ঢাকা", min: Math.round(todayVal * 0.9), max: Math.round(todayVal * 1.1), avg: todayVal },
                      { name: "নিউ মার্কেট কাঁচাবাজার", division: "ঢাকা", min: Math.round(todayVal * 0.92), max: Math.round(todayVal * 1.08), avg: todayVal },
                      { name: "মিরপুর ১ নম্বর বাজার", division: "ঢাকা", min: Math.round(todayVal * 0.95), max: Math.round(todayVal * 1.12), avg: Math.round(todayVal * 1.02) },
                    ]
                ).map((bazar, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-2 font-bold text-gray-900">{bazar.name}</td>
                    <td className="py-3.5 px-2 text-gray-500">{bazar.division}</td>
                    <td className="py-3.5 px-2 text-right font-bold text-gray-800">
                      {toBanglaDigits(bazar.min)} টাকা
                    </td>
                    <td className="py-3.5 px-2 text-right font-bold text-gray-800">
                      {toBanglaDigits(bazar.max)} টাকা
                    </td>
                    <td className="py-3.5 px-2 text-right font-extrabold text-gray-900">
                      {toBanglaDigits(bazar.avg)} টাকা
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}