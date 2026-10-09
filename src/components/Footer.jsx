export default function Footer() {
  return (
    <footer className="bg-[#fafafa] border-t border-gray-200 py-6 text-xs text-gray-500 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-medium text-gray-700">
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </div>
    </footer>
  );
}