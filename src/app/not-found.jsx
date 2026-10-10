import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#f2f5f3] flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xs max-w-md w-full space-y-5">
        <div className="text-6xl">🔍</div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900">৪০৪</h1>
          <h2 className="text-lg font-bold text-gray-800">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি!
          </h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            আপনি যে পেজটি খুঁজছেন তা হয়তো মুছে ফেলা হয়েছে অথবা লিংকটি ভুল দেওয়া হয়েছে।
          </p>
        </div>

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