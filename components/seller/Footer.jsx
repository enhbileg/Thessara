"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useTheme } from "@/context/appTheme";
import { useAppContext } from "@/context/AppContext";

const AdminFooter = () => {
  const [settings, setSettings] = useState(null);
  const { theme } = useTheme();
  const { language } = useAppContext();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/${language}/api/admin/settings`);
        const data = await res.json();
        if (res.success) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, [language]);

  return (
    <footer className="w-full px-10 py-6 border-t border-gray-300 dark:border-gray-700">
      {/* ✅ Grid layout: 2 columns on desktop, 1 column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between">
        
        {/* ✅ Logo хэсэг */}
        <div className="flex items-center gap-4">
          <Image
            className="w-28 md:w-32 transition-all duration-300"
            src={theme === "dark" ? assets.darkLogo : assets.lightLogo}
            alt="logo"
          />
          <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
          <p className="py-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {settings?.siteName || "Thessara"} — All Rights Reserved.
          </p>
        </div>

        {/* ✅ Contact info + Social icons хэсэг */}
        <div className="flex flex-col md:flex-row md:justify-end items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          {settings && (
            <>
              <span>📞 {settings.contactPhone}</span>
              <span>✉️ {settings.supportEmail}</span>
              <span>📍 {settings.contactAddress}</span>
              <span>⏰ {settings.workingHours}</span>
            </>
          )}
          <div className="flex items-center gap-3 mt-2 md:mt-0">
            {settings?.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer">
                <Image src={assets.facebook_icon} alt="facebook_icon" width={24} height={24} />
              </a>
            )}
            {settings?.socialLinks?.twitter && (
              <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer">
                <Image src={assets.twitter_icon} alt="twitter_icon" width={24} height={24} />
              </a>
            )}
            {settings?.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer">
                <Image src={assets.instagram_icon} alt="instagram_icon" width={24} height={24} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
