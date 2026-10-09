"use client";

import { useState, useEffect } from "react";
import { useSession, signOut, updateUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [name, setName] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session]);

  // সেশন না থাকলে সাইন ইন পেজে পাঠাবে
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নাম ফাঁকা রাখা যাবে না");
      return;
    }

    setUpdating(true);
    try {
      const { error } = await updateUser({
        name: name,
      });

      if (error) {
        toast.error(error.message || "নাম আপডেট করতে সমস্যা হয়েছে");
      } else {
        toast.success("নাম সফলভাবে আপডেট হয়েছে!");
      }
    } catch (err) {
      console.error(err);
      toast.error("একটি সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("সাইন আউট সফল হয়েছে");
    router.push("/");
  };

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 font-medium">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-[#f2f5f3] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* Top Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={
                session.user?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  session.user?.name || "User"
                )}&background=009645&color=fff`
              }
              alt={session.user?.name || "Profile"}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
            />
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {session.user?.name || "ইউজার"}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {session.user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <span>↵</span> সাইন আউট
          </button>
        </div>

        {/* Info Update Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-gray-100 space-y-4">
          <h3 className="text-base font-bold text-gray-900">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full px-4 py-3 text-sm bg-[#f9fafb] border border-gray-200 rounded-xl focus:outline-none focus:border-[#009645] transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-[#009645] hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition shadow-xs text-sm disabled:opacity-50 cursor-pointer"
            >
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}