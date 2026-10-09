"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

// সব সম্ভাব্য স্ল্যাগ ও তাদের বাংলা নাম/আইকন ম্যাপিং
const categoryMap = {
  // চাল
  rice: { nameBn: "চাল", icon: "🍚", keys: ["rice", "chal"] },
  chal: { nameBn: "চাল", icon: "🍚", keys: ["rice", "chal"] },

  // ডাল
  lentil: { nameBn: "ডাল", icon: "🫘", keys: ["lentil", "dal"] },
  dal: { nameBn: "ডাল", icon: "🫘", keys: ["lentil", "dal"] },

  // তেল
  oil: { nameBn: "তেল", icon: "🛢️", keys: ["oil", "tel"] },
  tel: { nameBn: "তেল", icon: "🛢️", keys: ["oil", "tel"] },

  // সবজি
  vegetable: { nameBn: "সবজি", icon: "🥦", keys: ["vegetable", "sobji", "vegetables"] },
  sobji: { nameBn: "সবজি", icon: "🥦", keys: ["vegetable", "sobji", "vegetables"] },

  // মাছ
  fish: { nameBn: "মাছ", icon: "🐟", keys: ["fish", "mach"] },
  mach: { nameBn: "মাছ", icon: "🐟", keys: ["fish", "mach"] },

  // মাংস
  meat: { nameBn: "মাংস", icon: "🥩", keys: ["meat", "mangsho"] },
  mangsho: { nameBn: "মাংস", icon: "🥩", keys: ["meat", "mangsho"] },

  // ডিম-দুধ
  egg: { nameBn: "ডিম-দুধ", icon: "🥛", keys: ["egg", "milk", "egg-milk", "dim-dudh"] },
  milk: { nameBn: "ডিম-দুধ", icon: "🥛", keys: ["egg", "milk", "egg-milk", "dim-dudh"] },
  "egg-milk": { nameBn: "ডিম-দুধ", icon: "🥛", keys: ["egg", "milk", "egg-milk", "dim-dudh"] },
  "dim-dudh": { nameBn: "ডিম-দুধ", icon: "🥛", keys: ["egg", "milk", "egg-milk", "dim-dudh"] },

  // মসলা
  spice: { nameBn: "মসলা", icon: "🌶️", keys: ["spice", "moshla", "spices"] },
  moshla: { nameBn: "মসলা", icon: "🌶️", keys: ["spice", "moshla", "spices"] },
};

// সকল ক্যাটাগরির লোকাল ফলব্যাক ডাটা
const dummyProducts = [
  // চাল
  { id: "1", slug: "swarna-chal", nameBn: "স্বর্ণাছি চাল", unit: "প্রতি কেজি", today: 48, change: { dir: "up", pct: 2.1 }, categorySlug: "rice" },
  { id: "2", slug: "miniket-chal", nameBn: "মিনিকেট চাল", unit: "প্রতি কেজি", today: 99, change: { dir: "down", pct: 2.9 }, categorySlug: "rice" },
  { id: "3", slug: "nazir-chal", nameBn: "নাজির চাল", unit: "প্রতি কেজি", today: 74, change: { dir: "neutral", pct: 0.0 }, categorySlug: "rice" },
  { id: "4", slug: "batam-chal", nameBn: "বাটাম সাইজ চাল", unit: "প্রতি কেজি", today: 66, change: { dir: "up", pct: 3.1 }, categorySlug: "rice" },

  // ডাল
  { id: "5", slug: "masur-dal", nameBn: "মসুর ডাল", unit: "প্রতি কেজি", today: 142, change: { dir: "up", pct: 2.9 }, categorySlug: "lentil" },
  { id: "6", slug: "chola", nameBn: "ছোলা", unit: "প্রতি কেজি", today: 120, change: { dir: "down", pct: 2.4 }, categorySlug: "lentil" },
  { id: "7", slug: "mung-dal", nameBn: "মুগ ডাল", unit: "প্রতি কেজি", today: 160, change: { dir: "up", pct: 1.2 }, categorySlug: "lentil" },

  // তেল
  { id: "8", slug: "shorisha-tel", nameBn: "সরিষার তেল", unit: "প্রতি লিটার", today: 190, change: { dir: "up", pct: 0.8 }, categorySlug: "oil" },
  { id: "9", slug: "soyabean-tel", nameBn: "সয়াবিন তেল", unit: "প্রতি লিটার", today: 168, change: { dir: "down", pct: 1.2 }, categorySlug: "oil" },

  // সবজি
  { id: "10", slug: "deshi-alu", nameBn: "দেশি আলু", unit: "প্রতি কেজি", today: 35, change: { dir: "down", pct: 5.0 }, categorySlug: "vegetable" },
  { id: "11", slug: "deshi-peyaj", nameBn: "দেশি পেঁয়াজ", unit: "প্রতি কেজি", today: 65, change: { dir: "up", pct: 3.2 }, categorySlug: "vegetable" },
  { id: "12", slug: "tomato", nameBn: "টমেটো", unit: "প্রতি কেজি", today: 80, change: { dir: "down", pct: 4.1 }, categorySlug: "vegetable" },
  { id: "13", slug: "begun", nameBn: "বেগুন", unit: "প্রতি কেজি", today: 60, change: { dir: "up", pct: 2.0 }, categorySlug: "vegetable" },

  // মাছ
  { id: "14", slug: "rui-mach", nameBn: "রুই মাছ", unit: "প্রতি কেজি", today: 320, change: { dir: "up", pct: 1.5 }, categorySlug: "fish" },
  { id: "15", slug: "katla-mach", nameBn: "কাতলা মাছ", unit: "প্রতি কেজি", today: 350, change: { dir: "neutral", pct: 0.0 }, categorySlug: "fish" },
  { id: "16", slug: "ilish-mach", nameBn: "ইলিশ মাছ", unit: "প্রতি কেজি", today: 1200, change: { dir: "up", pct: 5.2 }, categorySlug: "fish" },

  // মাংস
  { id: "17", slug: "gorur-mangsho", nameBn: "গরুর মাংস", unit: "প্রতি কেজি", today: 750, change: { dir: "neutral", pct: 0.0 }, categorySlug: "meat" },
  { id: "18", slug: "murgir-mangsho", nameBn: "মুরগির মাংস (ব্রয়লার)", unit: "প্রতি কেজি", today: 175, change: { dir: "down", pct: 2.0 }, categorySlug: "meat" },
  { id: "19", slug: "khasir-mangsho", nameBn: "খাসির মাংস", unit: "প্রতি কেজি", today: 1100, change: { dir: "up", pct: 1.1 }, categorySlug: "meat" },

  // ডিম-দুধ
  { id: "20", slug: "farm-dim", nameBn: "ফার্মের ডিম", unit: "প্রতি ডজন", today: 145, change: { dir: "down", pct: 3.0 }, categorySlug: "egg" },
  { id: "21", slug: "dudh", nameBn: "খাটি তরল দুধ", unit: "প্রতি লিটার", today: 90, change: { dir: "neutral", pct: 0.0 }, categorySlug: "egg" },

  // মসলা
  { id: "22", slug: "rosun", nameBn: "রসুন (দেশি)", unit: "প্রতি কেজি", today: 210, change: { dir: "up", pct: 4.5 }, categorySlug: "spice" },
  { id: "23", slug: "ada", nameBn: "আদা", unit: "প্রতি কেজি", today: 240, change: { dir: "down", pct: 1.8 }, categorySlug: "spice" },
  { id: "24", slug: "halud", nameBn: "হলুদ গুঁড়া", unit: "প্রতি ২০০ গ্রাম", today: 85, change: { dir: "neutral", pct: 0.0 }, categorySlug: "spice" },
];

export default function CategoryPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { slug } = params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");

  const cleanSlug = slug?.toLowerCase() || "";
  const currentCategory = categoryMap[cleanSlug] || {
    nameBn: slug ? slug.toUpperCase() : "ক্যাটাগরি",
    icon: "📦",
    keys: [cleanSlug],
  };

  const toBanglaDigits = (num) => {
    if (num === null || num === undefined) return "০";
    return num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  // ডাটা ম্যাচিং লজিক
  const isMatchCategory = (itemCat) => {
    if (!itemCat) return false;
    const cat = itemCat.toLowerCase();
    const validKeys = currentCategory.keys || [cleanSlug];
    return validKeys.includes(cat) || categoryMap[cat]?.nameBn === currentCategory.nameBn;
  };

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products").catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const filtered = data.filter((item) =>
              isMatchCategory(item.categorySlug || item.category || item.categoryName)
            );

            if (filtered.length > 0) {
              setProducts(filtered);
            } else {
              fallbackData();
            }
          } else {
            fallbackData();
          }
        } else {
          fallbackData();
        }
      } catch (err) {
        fallbackData();
      } finally {
        setLoading(false);
      }
    }

    function fallbackData() {
      const filtered = dummyProducts.filter((item) => isMatchCategory(item.categorySlug));
      setProducts(filtered);
    }

    fetchProducts();
  }, [cleanSlug]);

  // সাজানো (Sorting) লজিক
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "low-to-high") return a.today - b.today;
    if (sortOrder === "high-to-low") return b.today - a.today;
    return 0;
  });

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#f2f5f3] py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">
            {currentCategory.icon}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {currentCategory.nameBn}
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {toBanglaDigits(sortedProducts.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* Sort Control */}
        <div className="bg-white rounded-2xl px-6 py-4 shadow-xs border border-gray-100 flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-gray-500 font-medium">সাজান:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 py-2 px-3 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>

        {/* Loading State / Product Grid / Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProducts.map((product, idx) => (
              <Link
                key={product.id || idx}
                href={`/product/${product.slug || product.id || "deshi-alu"}`}
                className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between space-y-4 hover:shadow-md transition group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                    {product.categoryIcon || currentCategory.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-[#009645] transition">
                      {product.nameBn}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {product.unit || "প্রতি কেজি"}
                    </p>
                  </div>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-gray-50">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">আজকের দাম</p>
                    <p className="text-lg font-extrabold text-gray-900 mt-0.5">
                      {toBanglaDigits(product.today)} <span className="text-xs font-normal">টাকা</span>
                    </p>
                  </div>

                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      product.change?.dir === "up"
                        ? "bg-red-50 text-red-500"
                        : product.change?.dir === "down"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span>
                      {product.change?.dir === "up" ? "▲" : product.change?.dir === "down" ? "▼" : "—"}
                    </span>
                    <span>{toBanglaDigits(product.change?.pct || 0)}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4 my-6">
            <div className="text-5xl">🔍</div>
            <h2 className="text-xl font-bold text-gray-900">ক্যাটাগরি বা পণ্য পাওয়া যায়নি!</h2>
            <p className="text-xs text-gray-500 font-medium">
              আপনার খোঁজা ক্যাটাগরিতে এই মুহূর্তে কোনো তথ্য নেই।
            </p>
            <Link
              href="/"
              className="inline-block bg-[#009645] hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition text-sm shadow-xs"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}