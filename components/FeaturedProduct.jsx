"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useRouter } from "next/navigation";

const FeaturedProduct = () => {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);

  // ✅ Settings API‑аас featuredProducts авах
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (res.ok && data.success) {
          setFeatured(data.settings.featuredProducts || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  // ✅ Products API‑аас бүх бараа авах
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product/list");
        const data = await res.json();
        if (data.success) setProducts(data.products || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Settings.featuredProducts доторх id‑г ашиглаж products шүүх
  const selectedProducts = products.filter((p) =>
    featured.some((f) => f.id === p._id)
  );

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-button mt-2"></div>
      </div>

      <div className="mt-12 px-4 md:px-0">
        {/* Mobile */}
        <div className="grid md:hidden grid-cols-1 gap-8">
          {selectedProducts.map((p) => (
            <Card key={p._id} product={p} mobile />
          ))}
        </div>

        {/* Desktop */}
        <div
          className={`hidden md:block ${
            selectedProducts.length <= 3 ? "px-[20vw]" : "px-14"
          }`}
        >
          <div
            className={`grid gap-8 lg:gap-14 ${
              selectedProducts.length >= 4
                ? "grid-cols-4"
                : selectedProducts.length === 3
                ? "grid-cols-3"
                : selectedProducts.length === 2
                ? "grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {selectedProducts.slice(0, 4).map((p) => (
              <Card key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ product, mobile }) => {
  const { _id, name, offerPrice, image } = product || {};
  const src = Array.isArray(image) ? image[0] : image;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div
      className="relative group overflow-hidden rounded-xl aspect-[4/5]"
      onClick={() => {
        if (mobile) setOpen((prev) => !prev);
      }}
    >
      <Image
        fill
        src={src}
        alt={name}
        className="object-cover transition duration-300 group-hover:brightness-75"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent z-10"></div>

      {/* Title */}
      <div
        className={`absolute left-6 text-white z-20 transition-all duration-500
          ${
            mobile
              ? open
                ? "bottom-[40%]" // ✅ утсан дээр click → дээшилнэ
                : "bottom-10"
              : "bottom-10 group-hover:bottom-[40%]" // ✅ desktop дээр hover → дээшилнэ
          }
        `}
      >
        <p className="font-medium text-xl lg:text-2xl">{name}</p>
      </div>

      {/* Price + Button */}
      <div
        className={`absolute left-6 right-6 bottom-10 text-white transition-all duration-500 z-20
          ${
            mobile
              ? open
                ? "opacity-100"
                : "opacity-0"
              : "opacity-0 group-hover:opacity-100"
          }
        `}
      >
        <p className="text-lg font-semibold mt-1">
          ₮ {Number(offerPrice).toLocaleString("mn-MN")}
        </p>
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${_id}`);
            }}
            className="flex items-center gap-1.5 bg-button px-4 py-2 rounded transition-transform duration-300 hover:scale-105"
          >
            Buy now
            <Image
              className="h-3 w-3"
              src={assets.redirect_icon}
              alt="Redirect Icon"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
