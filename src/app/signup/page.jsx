"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("সবগুলো তথ্য সঠিকভাবে প্রদান করুন");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (error) {
        toast.error(error.message || "সাইন আপ করতে সমস্যা হয়েছে");
      } else {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("একটি সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    try {
      await signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err) {
      console.error(err);
      toast.error("সোশ্যাল সাইন ইন করা যাচ্ছে না");
    }
  };

  return (
    <div className="w-full bg-[#f2f5f3] flex-1 flex flex-col items-center justify-center px-4 py-10">
      {/* Title Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-xs text-gray-500 font-medium mt-1">
          বিনামূল্যে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              নাম
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="যেমন: রহিম উদ্দিন"
              className="w-full px-4 py-2.5 text-sm bg-[#f9fafb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#009645] transition"
              required
            />
          </div>

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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="আবার লিখুন"
              className="w-full px-4 py-2.5 text-sm bg-[#f9fafb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#009645] transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#009645] hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition shadow-xs text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
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
            onClick={() => handleSocialSignUp("google")}
            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-700 transition cursor-pointer"
          >
            <span className="text-sm">🌐</span> Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignUp("github")}
            className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-semibold text-gray-700 transition cursor-pointer"
          >
            <span className="text-sm">🐙</span> GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        {/* Already have account */}
        <p className="text-center text-xs text-gray-500 font-medium mt-6">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="text-[#009645] font-bold hover:underline"
          >
            সাইন ইন করুন
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