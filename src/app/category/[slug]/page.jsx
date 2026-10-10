"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

const categoryMap = {
  rice: { nameBn: "চাল", icon: "🍚" },
  chal: { nameBn: "চাল", icon: "🍚" },
  lentil: { nameBn: "ডাল", icon: "🫘" },
  dal: { nameBn: "ডাল", icon: "🫘" },
  oil: { nameBn: "তেল", icon: "🛢️" },
  tel: { nameBn: "তেল", icon: "🛢️" },
  vegetable: { nameBn: "সবজি", icon: "🥦" },
  sobji: { nameBn: "সবজি", icon: "🥦" },
  fish: { nameBn: "মাছ", icon: "🐟" },
  mach: { nameBn: "মাছ", icon: "🐟" },
  meat: { nameBn: "মাংস", icon: "🥩" },
  mangsho: { nameBn: "মাংস", icon: "🥩" },
  egg: { nameBn: "ডিম-দুধ", icon: "🥛" },
  milk: { nameBn: "ডিম-দুধ", icon: "🥛" },
  spice: { nameBn: "মসলা", icon: "🌶️" },
  moshla: { nameBn: "মসলা", icon: "🌶️" },
};

// নাম দেখে নির্দিষ্ট প্রোডাক্টের ছবি/ইমোজি বের করার হেল্পার
const getProductEmoji = (name = "", categoryIcon = "📦") => {
  const str = name.toLowerCase();
  if (str.includes("আলু")) return "🥔";
  if (str.includes("পেঁয়াজ") || str.includes("পেয়াজ")) return "🧅";
  if (str.includes("মরিচ") || str.includes("কাঁচামরিচ")) return "🌶️";
  if (str.includes("বেগুন")) return "🍆";
  if (str.includes("ঢেঁড়স") || str.includes("ঢেড়স")) return "🌱";
  if (str.includes("টমেটো")) return "🍅";
  if (str.includes("রসুন")) return "🧄";
  if (str.includes("আদা")) return "🫚";
  if (str.includes("চাল")) return "🍚";
  if (str.includes("ডাল") || str.includes("ছোলা")) return "🫘";
  if (str.includes("তেল")) return "🛢️";
  if (str.includes("রুই") || str.includes("মাছ") || str.includes("কাতলা") || str.includes("ইলিশ")) return "🐟";
  if (str.includes("গরু") || str.includes("মাংস") || str.includes("খাসি")) return "🥩";
  if (str.includes("মুরগি")) return "🍗";
  if (str.includes("ডিম")) return "🥚";
  if (str.includes("দুধ")) return "🥛";
  return categoryIcon;
};

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
  };

  const toBanglaDigits = (num) => {
  if (num === null || num === undefined) return "০";
  const banglaNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().replace(/\d/g, (digit) => banglaNumerals[digit]);
};

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(`https://api.abcz.workers.dev/api/bazardor/products?category=${cleanSlug}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch category products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [cleanSlug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "low-to-high") return (a.today || a.todayPrice) - (b.today || b.todayPrice);
    if (sortOrder === "high-to-low") return (b.today || b.todayPrice) - (a.today || a.todayPrice);
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

        {/* Loading / Product Grid / Empty State */}
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
            {sortedProducts.map((product, idx) => {
              const productName = product.nameBn || product.name || "";
              const productIcon =
                product.image ||
                product.icon ||
                product.categoryIcon ||
                getProductEmoji(productName, currentCategory.icon);

              return (
                <Link
                  key={product.id || idx}
                  href={`/product/${product.id || product.slug}`}
                  className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between space-y-4 hover:shadow-md transition group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                      {productIcon.startsWith("http") ? (
                        <img src={productIcon} alt={productName} className="w-8 h-8 object-contain" />
                      ) : (
                        productIcon
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base group-hover:text-[#009645] transition">
                        {productName}
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
                        {toBanglaDigits(product.today || product.todayPrice)}{" "}
                        <span className="text-xs font-normal">টাকা</span>
                      </p>
                    </div>

                    <div
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        product.change?.dir === "up" || product.changeDir === "up"
                          ? "bg-red-50 text-red-500"
                          : product.change?.dir === "down" || product.changeDir === "down"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span>
                        {product.change?.dir === "up" || product.changeDir === "up" ? "▲" : "▼"}
                      </span>
                      <span>{toBanglaDigits(product.change?.pct || product.changePct || 0)}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
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