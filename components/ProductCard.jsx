"use client";
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

const ProductCard = ({ product }) => {
  const { currency, router, language } = useAppContext();
  const [dict, setDict] = React.useState({});

  React.useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  // ✅ Хямдралын хувь тооцоолох (дээд тал нь 99%)
  let discountPercent = 0;
  if (product.price && product.offerPrice) {
    discountPercent = Math.round(
      ((product.price - product.offerPrice) / product.price) * 100
    );
    if (discountPercent > 99) discountPercent = 99;
  }

  // ✅ Rating model‑оос авах
  const rating = product.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div
      onClick={() => {
        router.push(`/${language}/product/${product._id}`);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-0.5 max-w-[220px] w-full cursor-pointer"
    >
      <div className="cursor-pointer group relative bg-gray-500/10 rounded-xl w-full h-56 flex items-center justify-center overflow-hidden">
        <Image
          src={product.image[0]}
          alt={product.name}
          className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
          width={800}
          height={800}
        />

        {/* ✅ Хямдралын badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-gradient-to-r from-red-600 via-pink-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
              -{discountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* ✅ Product name */}
      <p className="md:text-base font-medium pt-2 w-full truncate">
        {product.name}
      </p>

      {/* ✅ Product description */}
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
        {product.description}
      </p>

      {/* ✅ Rating */}
      <div className="flex items-center gap-2 mt-1">
        <p className="text-xs">{rating.toFixed(1)}</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => {
            if (index < fullStars) {
              return (
                <Image
                  key={index}
                  className="h-3 w-3"
                  src={assets.star_icon}
                  alt="star_icon"
                />
              );
            } else if (index === fullStars && hasHalfStar) {
              return (
                <Image
                  key={index}
                  className="h-3 w-3"
                  src={assets.star_half_icon || assets.star_dull_icon}
                  alt="half_star_icon"
                />
              );
            } else {
              return (
                <Image
                  key={index}
                  className="h-3 w-3"
                  src={assets.star_dull_icon}
                  alt="star_dull_icon"
                />
              );
            }
          })}
        </div>
      </div>

      {/* ✅ Price section */}
      <div className="flex items-end justify-between w-full mt-2">
        <div className="flex flex-col">
          <p className="text-base font-semibold text-specialText">
            {currency}
            {Number(product.offerPrice).toLocaleString("mn-MN")}
          </p>
          {product.price && (
            <p className="text-xs text-gray-500 line-through">
              {currency}
              {Number(product.price).toLocaleString("mn-MN")}
            </p>
          )}
        </div>

        <button
    onClick={(e) => {
      e.stopPropagation();
      router.push(`/${language}/cart`);
    }}
    className="max-sm:hidden px-4 py-1.5 text-gray-700 border border-gray-300 rounded-full text-xs hover:bg-purple-50 transition"
  >
    {dict.buyNow || "Buy now"}
  </button>
      </div>
    </div>
  );
};

export default ProductCard;
