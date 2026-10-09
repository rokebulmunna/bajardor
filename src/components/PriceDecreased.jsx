"use client";

import { useEffect, useState } from "react";

export default function PriceDecreased() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDecreasedProducts() {
      try {
        const res = await fetch(
          "https://api.abcz.workers.dev/api/bazardor/products"
        ).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();

          if (isMounted && Array.isArray(data)) {
            // Filter products where price decreased (change.dir === 'down')
            const decreased = data.filter((item) => item.change?.dir === "down");
            setProducts(decreased);
          }
        }
      } catch (err) {
        console.error("Error fetching price decreased products:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDecreasedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const toBanglaDigits = (num) => {
    if (num === null || num === undefined) return "০";
    return num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto my-8 px-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-36 bg-gray-100 animate-pulse rounded-2xl"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto my-10 px-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-emerald-700 font-bold text-lg">▼</span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          আজ দাম কমেছে
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((item) => {
          const name = item.nameBn || "পণ্য";
          const price = item.today ?? 0;
          const unit = item.unit || "কেজি";
          const pct = item.change?.pct ?? 0;
          const icon = item.categoryIcon || "🥬";

          return (
            <div
              key={item.id || item.slug}
              className="bg-[#f9fbf9] border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Top Row: Icon + Name & Unit */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug">
                    {name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    প্রতি{" "}
                    {unit === "kg"
                      ? "কেজি"
                      : unit === "litre"
                      ? "লিটার"
                      : unit === "dozen"
                      ? "ডজন"
                      : unit}
                  </p>
                </div>
              </div>

              {/* Bottom Row: Today's Price & Percentage Decrease Badge */}
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">
                    আজকের দাম
                  </p>
                  <p className="text-xl font-extrabold text-gray-900 leading-none">
                    {toBanglaDigits(price)}{" "}
                    <span className="text-sm font-semibold text-gray-700">
                      টাকা
                    </span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <span>▼</span>
                  <span>{toBanglaDigits(pct.toString())}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}