"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useRouter } from "next/navigation";

const FeaturedProduct = () => {
  const [products, setProducts] = useState([]);
  const [ratios, setRatios] = useState({}); // {_id: ratio}

  const selectedIndexes = [0, 1, 2]; // жишээ сонгосон индексүүд

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product/list");
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProducts();
  }, []);

  const selectedProducts = selectedIndexes
    .map((i) => products[i])
    .filter(Boolean);

  useEffect(() => {
    if (!selectedProducts.length) return;
    const loadRatios = async () => {
      const entries = await Promise.all(
        selectedProducts.map(
          (p) =>
            new Promise((resolve) => {
              const img = new window.Image();
              const src = Array.isArray(p.image) ? p.image[0] : p.image;
              img.src = src;
              img.onload = () => resolve([p._id, img.width / img.height]);
              img.onerror = () => resolve([p._id, 1]);
            })
        )
      );
      setRatios(Object.fromEntries(entries));
    };
    loadRatios();
  }, [selectedProducts]);

  const landscapeIndex = selectedProducts.findIndex(
    (p) => ratios[p?._id] && ratios[p._id] > 1
  );

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-button mt-2"></div>
      </div>

      <div className="mt-12 md:px-14 px-4">
        {/* Mobile */}
        <div className="grid md:hidden grid-cols-1 gap-8">
          {selectedProducts.map((p) => (
            <Card key={p._id} product={p} mobile />
          ))}
        </div>

        {/* Desktop */}
        {landscapeIndex !== -1 ? (
          <div className="hidden md:grid gap-8 lg:gap-14">
            <Card product={selectedProducts[landscapeIndex]} wide />
            <div className="grid grid-cols-2 gap-8 lg:gap-14">
              {selectedProducts
                .filter((_, idx) => idx !== landscapeIndex)
                .slice(0, 2)
                .map((p) => (
                  <Card key={p._id} product={p} />
                ))}
            </div>
          </div>
        ) : (
          <div className="hidden md:grid grid-cols-3 gap-8 lg:gap-14">
            {selectedProducts.map((p) => (
              <Card key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Card = ({ product, wide, mobile }) => {
  const { _id, name, offerPrice, image } = product || {};
  const src = Array.isArray(image) ? image[0] : image;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div
      className={`relative group overflow-hidden rounded-xl ${
        wide ? "aspect-video" : "aspect-[4/5]"
      }`}
      onClick={() => {
        if (mobile) setOpen((prev) => !prev);
      }}
    >
      {/* Зураг */}
      <Image
        fill
        src={src}
        alt={name}
        className="object-cover transition duration-300 group-hover:brightness-75"
      />

      {/* Доороос нь gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent z-10"></div>

      {/* Title */}
      <div
        className={`absolute left-6 text-white z-20 transition-all duration-500 
          ${mobile ? (open ? "bottom-[40%]" : "bottom-10") : "bottom-10 group-hover:bottom-[20%]"}
        `}
      >
        <p className="font-medium text-xl lg:text-2xl">{name}</p>
      </div>

      {/* Price + Button */}
      <div
        className={`absolute left-6 right-6 bottom-10 text-white transition-all duration-500 z-20
          ${mobile ? (open ? "opacity-100" : "opacity-0") : "opacity-0 group-hover:opacity-100"}
        `}
      >
        <p className="text-lg font-semibold mt-1">
          ₮ {Number(offerPrice).toLocaleString("mn-MN")}
        </p>
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${_id}`); // ✅ тухайн product detail page руу орно
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
