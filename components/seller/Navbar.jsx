"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useTheme } from "@/context/appTheme";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/seller/dashboard" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
    { name: "Settings", path: "/admin/settings" },
  ];

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
        <span className="font-semibold text-lg hidden sm:block">Admin Panel</span>
      </Link>

      {/* ==== Right Side ==== */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <FiMenu className="text-xl" />
        </button>
      </div>

      {/* ==== Mobile Popup Menu ==== */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setOpen(false)}
          ></div>

          {/* Drawer */}
          <aside
            className="relative w-64 bg-white dark:bg-gray-900 shadow-lg flex flex-col transform transition-transform duration-300 ease-out animate-slideIn"
          >
            <div className="p-4 flex justify-between items-center border-b">
              <span className="font-bold text-xl">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform duration-200 hover:translate-x-1"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
