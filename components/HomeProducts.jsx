"use client";
import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

const HomeProducts = () => {
  const { products, router, language } = useAppContext();
  const dict = getDictionary(language);

  return (
    <div className="flex flex-col items-center pt-14"> 
      {/* ✅ Гарчиг орчуулгатай */}
      <p className="text-2xl font-medium text-left w-full">
        {dict.popularProducts || "Popular products"}
      </p>

      {/* ✅ Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      {/* ✅ Button орчуулгатай + path хэлтэй */}
      <button
        onClick={() => router.push(`/${language}/all-products`)}
        className="px-12 py-2.5 bg-button rounded text-gray-500/70 hover:bg-slate-50/90 transition"
      >
        {dict.seeMore || "See more"}
      </button>
    </div>
  );
};

export default HomeProducts;
