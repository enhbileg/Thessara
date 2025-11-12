"use client";
import React from "react";
import Link from "next/link";
import { assets } from "../../assets/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();

  // Шинэ цэснүүд
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: assets.dashboard_light },
    { name: "Users", path: "/admin/users", icon: assets.user_icon },
    { name: "Products", path: "/admin/products", icon: assets.product_list_icon },
    { name: "Orders", path: "/admin/orders", icon: assets.order_icon },
  ];

  return (
    <div
      className="
        group 
        flex flex-col 
        border-r border-gray-300 dark:border-gray-700 
        min-h-screen 
        w-16 hover:w-64 
        transition-all duration-300 
        bg-white dark:bg-gray-900
      "
    >
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link href={item.path} key={item.name} passHref>
            <div
              className={`flex items-center py-3 px-4 gap-3 cursor-pointer transition-colors
                ${isActive
                  ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <Image
                src={item.icon}
                alt={`${item.name.toLowerCase()}_icon`}
                className="w-7 h-7 flex-shrink-0"
              />
              {/* Title зөвхөн hover үед гарна */}
              <span className="hidden group-hover:inline text-sm font-medium">
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
