'use client';
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useTheme } from "@/context/appTheme"; // ← theme context импортлоно

const Footer = () => {
  const { theme } = useTheme(); // ← одоогийн theme-г авна

  return (
    <footer className="transition-colors duration-300 bg-background dark:bg-dark-background text-text dark:text-dark-text">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500 dark:text-gray-400">
        
        {/* ✅ Logo + текст */}
        <div className="w-4/5">
          <Image
            className="w-28 md:w-32 transition-all duration-300"
            src={theme === "dark" ? assets.darkLogo : assets.lightLogo} // ← theme дагаж солигдоно
            alt="logo"
          />
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* ✅ Company хэсэг */}
        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-700 dark:text-gray-300 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a className="hover:underline transition" href="/">Home</a></li>
              <li><a className="hover:underline transition" href="#">About us</a></li>
              <li><a className="hover:underline transition" href="#">Contact us</a></li>
              <li><a className="hover:underline transition" href="#">Privacy policy</a></li>
            </ul>
          </div>
        </div>

        {/* ✅ Contact хэсэг */}
        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-700 dark:text-gray-300 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+97685769918</p>
              <p>enh.bom8@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Доорх copyright хэсэг */}
      <p className="py-4 text-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
        Copyright 2025 © Bilgee bn. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
