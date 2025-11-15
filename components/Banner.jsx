'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext"; // ✅ хэл context
import { getDictionary } from "@/app/[lang]/dictionaries.js"; // ✅ dictionary

const Banner = () => {
  const { language, router } = useAppContext();
  const [dict, setDict] = useState({});

  // ✅ Dictionary ачаалах
  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-backBanner my-16 rounded-xl overflow-hidden">
      <Image
        className="max-w-56"
        src={assets.jbl_soundbox_image}
        alt="jbl_soundbox_image"
      />
      
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          {dict.bannerTitle || "Level Up Your Gaming Experience"}
        </h2>
        <p className="max-w-[343px] font-medium text-specialText">
          {dict.bannerDescription || "From immersive sound to precise controls—everything you need to win"}
        </p>
        <button
          onClick={() => router.push(`/${language}/cart`)} // ✅ path хэлтэй
          className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-button text-specialText"
        >
          {dict.buyNow || "Buy now"}
          <Image 
            className="group-hover:translate-x-1 transition" 
            src={assets.arrow_icon_white} 
            alt="arrow_icon_white" 
          />
        </button>
      </div>

      <Image
        className="hidden md:block max-w-80"
        src={assets.md_controller_image}
        alt="md_controller_image"
      />
      <Image
        className="md:hidden"
        src={assets.sm_controller_image}
        alt="sm_controller_image"
      />
    </div>
  );
};

export default Banner;
