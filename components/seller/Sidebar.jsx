"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiX,
  FiHome,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiMail,
  FiSettings,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext"; // ✅ хэл context
import { getDictionary } from "@/app/[lang]/dictionaries.js";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { language } = useAppContext();
  const [dict, setDict] = useState({});

  // ✅ Dictionary ачаалах
  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  // ✅ Цэсний item‑ууд
  const menuItems = [
    { name: dict.dashboard || "Dashboard", path: `/${language}/admin/dashboard`, icon: <FiHome className="w-6 h-6" /> },
    { name: dict.users || "Users", path: `/${language}/admin/users`, icon: <FiUsers className="w-6 h-6" /> },
    { name: dict.products || "Products", path: `/${language}/admin/products`, icon: <FiBox className="w-6 h-6" /> },
    { name: dict.orders || "Orders", path: `/${language}/admin/orders`, icon: <FiShoppingCart className="w-6 h-6" /> },
    { name: dict.contact || "Contact", path: `/${language}/admin/contact`, icon: <FiMail className="w-6 h-6" /> },
    { name: dict.settings || "Settings", path: `/${language}/admin/settings`, icon: <FiSettings className="w-6 h-6" /> },
  ];

  return (
    <>
      {/* ✅ Desktop Sidebar */}
      <aside
        className="
          hidden md:flex
          group flex-col
          border-r border-gray-200 dark:border-gray-700
          min-h-screen
          w-16 hover:w-64
          transition-all duration-300
          bg-white dark:bg-gray-900
        "
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="hidden group-hover:inline font-bold text-lg text-gray-800 dark:text-gray-200">
            {dict.adminPanel || "Admin Panel"}
          </span>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link href={item.path} key={item.name}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors
                    ${isActive
                      ? "bg-violet-200 text-violet-800 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-primary"
                    }`}
                >
                  {item.icon}
                  <span className="hidden group-hover:inline text-sm font-medium">
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ✅ Mobile Popup Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setOpen(false)}
          ></div>

          {/* Drawer */}
          <aside
            className="relative w-64 bg-white dark:bg-gray-900 shadow-lg flex flex-col transform transition-transform duration-300 ease-out"
            style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
          >
            <div className="p-4 flex justify-between items-center border-b">
              <span className="font-bold text-xl">{dict.menu || "Menu"}</span>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 p-2 rounded ${
                      isActive
                        ? "bg-violet-800 text-violet-300 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
