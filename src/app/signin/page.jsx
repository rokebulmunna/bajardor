"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("ইমেইল এবং পাসওয়ার্ড প্রদান করুন");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
      } else {
        toast.success("সফলভাবে সাইন ইন হয়েছে!");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("একটি সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    setSocialLoading(provider);
    try {
      await signIn.social({
        provider,
        callbackURL: "https://bajardor-3qvim7w9b-alpha-381c.vercel.app",
      });
    } catch (err) {
      console.error(err);
      toast.error("সোশ্যাল সাইন ইন করা যাচ্ছে না");
      setSocialLoading(null);
    }
  };

  return (
    <div className="w-full bg-[#f2f5f3] flex-1 flex flex-col items-center justify-center px-4 py-10">
      {/* Title Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          সাইন ইন
        </h1>
        <p className="text-xs text-gray-500 font-medium mt-1">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              ইমেইল
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 text-sm bg-[#f9fafb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#009645] transition"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full px-4 py-2.5 text-sm bg-[#f9fafb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#009645] transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full mt-2 bg-[#009645] hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition shadow-xs text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] text-gray-400 font-medium">
            অথবা
          </span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading || !!socialLoading}
            onClick={() => handleSocialSignIn("google")}
            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-700 transition cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {socialLoading === "google" ? "অপেক্ষা করুন..." : "Google দিয়ে চালিয়ে যান"}
          </button>

          <button
            type="button"
            disabled={loading || !!socialLoading}
            onClick={() => handleSocialSignIn("github")}
            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-700 transition cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-current text-gray-900" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {socialLoading === "github" ? "অপেক্ষা করুন..." : "GitHub দিয়ে চালিয়ে যান"}
          </button>
        </div>

        {/* No account link */}
        <p className="text-center text-xs text-gray-500 font-medium mt-6">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="text-[#009645] font-bold hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      {/* Back to Home link */}
      <Link
        href="/"
        className="mt-6 text-xs font-medium text-gray-500 hover:text-gray-800 transition"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}