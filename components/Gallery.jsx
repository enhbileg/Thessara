"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const ProductImageGallery = ({ images = [], interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔁 Автоматаар солигдох
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* ======= Main Image ======= */}
      <div className="relative w-full max-w-[500px] aspect-square overflow-hidden rounded-2xl ">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          > {/* ==== Background Blur ==== */}
  <Image
    src={images[currentIndex]}
    alt="blur-bg"
    fill
    className="object-cover blur-2xl scale-105"
    priority
  />
            <Image
              src={img}
              alt={`product-image-${index}`}
              fill
              className="object-contain rounded-3xl"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* ======= Thumbnail Section ======= */}
      <div className="flex justify-center gap-3 mt-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative w-16 h-16 overflow-hidden rounded-md border ${
              currentIndex === index
                ? "border-purple-500"
                : "border-transparent"
            }`}
          >
            <Image
              src={img}
              alt={`thumb-${index}`}
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
