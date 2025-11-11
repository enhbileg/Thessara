"use client"
import React, { useState, useEffect } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, DarkModeIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useTheme } from "@/context/appTheme";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-4 border-b border-gray-200 dark:border-gray-700 bg-navbar text-navbar shadow-sm">
      
      {/* ==== Logo ==== */}
      <Link href="/" className="flex items-center gap-2 cursor-pointer">
        {theme === "dark" ? (
          <Image
            src={assets.darkLogo}
            alt="Dark logo"
            width={120}
            height={40}
            className="transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <Image
            src={assets.lightLogo}
            alt="Light logo"
            width={120}
            height={40}
            className="transition-transform duration-300 hover:scale-105"
          />
        )}
      </Link>

      {/* ==== Desktop Menu ==== */}
      <div className="hidden md:flex items-center gap-6 font-medium">
        <Link href="/" className="hover:text-purple-600 transition">Home</Link>
        <Link href="/all-products" className="hover:text-purple-600 transition">Shop</Link>
        <Link href="/about" className="hover:text-purple-600 transition">About Us</Link>
        <Link href="/contact" className="hover:text-purple-600 transition">Contact</Link>
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-sm border px-4 py-1.5 rounded-full hover:bg-purple-500 hover:text-white transition"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* ==== Right Side ==== */}
      <div className="flex items-center gap-4">
        <Image
          className="w-5 h-5 cursor-pointer hover:scale-110 transition"
          src={assets.search_icon}
          alt="search icon"
        />

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push("/cart")} />
              <UserButton.Action label="My orders" labelIcon={<BagIcon />} onClick={() => router.push("/my-orders")} />
              <UserButton.Action label="Dark/Light mode" labelIcon={<DarkModeIcon />} onClick={toggleTheme} />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border-blank hover:bg-purple-500 hover:text-white transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
