"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useClerk } from "@clerk/nextjs";
import { useTheme } from "@/context/appTheme";

const Navbar = () => {
  const { router } = useAppContext();
  const { signOut } = useClerk();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      {/* ==== Logo ==== */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        <Image
          src={theme === "dark" ? assets.darkLogo : assets.lightLogo}
          alt="Admin logo"
          width={120}
          height={40}
          className="transition-transform duration-300 hover:scale-105"
        />
        <span  className="font-semibold text-lg hidden sm:block">Admin Panel</span>
      </Link>

      {/* ==== Menu ==== */}
      <div className="hidden md:flex items-center gap-6 font-medium">
        <Link href="/seller/dashboard" className="hover:text-purple-600 transition">Dashboard</Link>
        <Link href="/admin/products" className="hover:text-purple-600 transition">Products</Link>
        <Link href="/admin/orders" className="hover:text-purple-600 transition">Orders</Link>
        <Link href="/admin/users" className="hover:text-purple-600 transition">Users</Link>
        <Link href="/admin/settings" className="hover:text-purple-600 transition">Settings</Link>
      </div>

      {/* ==== Right Side ==== */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        {/* Logout */}
        <button
          onClick={() => signOut(() => router.push("/"))}
          className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm transition hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
