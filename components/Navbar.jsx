"use client";
import React, { useState, useEffect } from "react";
import { assets, BagIcon, CartIcon, DarkModeIcon, DashboardIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useTheme } from "@/context/appTheme";
import { FaGlobe, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

const Navbar = () => {
  const pathname = usePathname();
  const { isSeller, router, user, language, toggleLanguage } = useAppContext();
  const { openSignIn } = useClerk();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dict, setDict] = useState({});

  useEffect(() => {
    setMounted(true);
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  if (!mounted) return null;

  const navItems = [
    { href: `/${language}`, label: dict.navHome || "Home" },
    { href: `/${language}/all-products`, label: dict.navShop || "Shop" },
    { href: `/${language}/about`, label: dict.navAbout || "About" },
    { href: `/${language}/contact`, label: dict.navContact || "Contact" },
  ];

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-4 border-b border-gray-200 dark:border-gray-700 bg-navbar shadow-sm">
      {/* ==== Logo ==== */}
      <Link href={`/${language}`} className="flex items-center gap-2 cursor-pointer">
        <Image
          src={theme === "dark" ? assets.darkLogo : assets.lightLogo}
          alt="Logo"
          width={120}
          height={40}
          className="transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* ==== Capsule Menu ==== */}
      <div className="hidden md:flex items-center gap-[1vw] font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center rounded-full px-4 py-2 transition-colors duration-300
                ${isActive
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"}
                hover:bg-purple-500 hover:text-white`}
            >
              {item.label}
            </Link>
          );
        })}

        {isSeller && (
          <button
            onClick={() => router.push(`/${language}/admin/dashboard`)}
            className="flex items-center justify-center rounded-full px-4 py-2 transition-colors duration-300 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-500 hover:text-white"
          >
            {dict.navDashboard || "Seller Dashboard"}
          </button>
        )}
      </div>

      {/* ==== Right Side ==== */}
      <div className="flex items-center gap-4">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <DarkModeIcon />
        </button>

        {/* 🌐 Language toggle */}
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <FaGlobe />
        </button>

        {/* User / Account */}
        {user ? (
          <UserButton afterSignOutUrl={`/${language}`}>
            <UserButton.MenuItems>
              <UserButton.Action
                label={dict.navCart || "Cart"}
                labelIcon={<CartIcon />}
                onClick={() => router.push(`/${language}/cart`)}
              />
              <UserButton.Action
                label={dict.navOrders || "My orders"}
                labelIcon={<BagIcon />}
                onClick={() => router.push(`/${language}/my-orders`)}
              />
              <UserButton.Action
                label={dict.navAbout || "About"}
                labelIcon={<FaInfoCircle />}
                onClick={() => router.push(`/${language}/about`)}
              />
              <UserButton.Action
                label={dict.navContact || "Contact"}
                labelIcon={<FaEnvelope />}
                onClick={() => router.push(`/${language}/contact`)}
              />
              {isSeller && (
                <UserButton.Action
                  label={dict.navAdmin || "Admin"}
                  labelIcon={<DashboardIcon />}
                  onClick={() => router.push(`/${language}/admin/dashboard`)}
                />
              )}
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-purple-500 hover:text-white transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            {dict.navAccount || "Account"}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
