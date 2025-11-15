"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useTheme } from "@/context/appTheme";
import { useAppContext } from "@/context/AppContext"; // ✅ хэл context
import { getDictionary } from "@/app/[lang]/dictionaries.js"; // ✅ dictionary

const Footer = () => {
  const { theme } = useTheme();
  const { language } = useAppContext();
  const [settings, setSettings] = useState(null);
  const [dict, setDict] = useState({});

  // ✅ Dictionary ачаалах
  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  // ✅ Settings fetch
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/${language}/api/admin/settings`);
        const data = await res.json();
        if (res.ok && data.success) {
          setSettings(data.settings);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    fetchSettings();
  }, [language]);

  return (
    <footer className="transition-colors duration-300 bg-background dark:bg-dark-background text-text dark:text-dark-text">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500 dark:text-gray-400">
        
        {/* ✅ Logo + текст */}
        <div className="w-4/5">
          <Image
            className="w-28 md:w-32 transition-all duration-300"
            src={theme === "dark" ? assets.darkLogo : assets.lightLogo}
            alt="logo"
          />
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            {settings?.siteName || "Thessara"} — {settings?.supportEmail || "support@Thessara.mn"}
          </p>
        </div>

        {/* ✅ Company хэсэг */}
        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-700 dark:text-gray-300 mb-5">
              {dict.company || "Company"}
            </h2>
            <ul className="text-sm space-y-2">
              <li><a className="hover:underline transition" href="/">{dict.home || "Home"}</a></li>
              <li><a className="hover:underline transition" href="/about">{dict.aboutUs || "About us"}</a></li>
              <li><a className="hover:underline transition" href="/contact">{dict.contactUs || "Contact us"}</a></li>
              <li><a className="hover:underline transition" href="/privacy">{dict.privacyPolicy || "Privacy policy"}</a></li>
            </ul>
          </div>
        </div>

        {/* ✅ Contact хэсэг */}
        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-700 dark:text-gray-300 mb-5">
              {dict.getInTouch || "Get in touch"}
            </h2>
            <div className="text-sm space-y-2">
              <p>{settings?.contactPhone || "+976 8888-0000"}</p>
              <p>{settings?.supportEmail || "support@Thessara.mn"}</p>
              <p>{settings?.contactAddress || "Ulaanbaatar, Mongolia"}</p>
              <p>{settings?.workingHours || "Mon-Fri: 9:00 AM – 6:00 PM"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Доорх copyright хэсэг */}
      <p className="py-4 text-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} {settings?.siteName || "Thessara"} — All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
