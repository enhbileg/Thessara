"use client";
import React, { useState, useEffect, useRef } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const HeaderSlider = () => {
  const { router } = useAppContext();
  const [sliderData, setSliderData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Settings API‑аас slider data авах
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (res.ok && data.success) {
          setSliderData(data.settings.slider || []);
        } else {
          toast.error(data.message || "Failed to load slider");
        }
      } catch {
        toast.error("Server error");
      }
    };
    fetchSlider();
  }, []);

  // Автомат slide
  useEffect(() => {
    if (sliderData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderData]);

  // Swipe (утас)
  const startX = useRef(0);
  const endX = useRef(0);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    endX.current = e.changedTouches[0].clientX;
    const diff = startX.current - endX.current;
    if (diff > 50) {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    } else if (diff < -50) {
      setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
    }
  };

  // Arrow click
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  if (sliderData.length === 0) return null;

  return (
    <div
      className="overflow-hidden relative w-full group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-backBanner py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-specialText pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6 ">
                <button
                  onClick={() => router.push("/all-products")}
                  className="md:px-10 px-7 md:py-2.5 py-2 bg-button rounded-full text-specialText font-medium"
                >
                  {slide.buttonText1}
                </button>
                <button
                  onClick={() => router.push("/all-products")}
                  className="group flex items-center gap-2 px-6 py-2.5 font-medium"
                >
                  {slide.buttonText2}
                  <Image
                    className="group-hover:translate-x-1 transition"
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                  />
                </button>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <Image
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
                width={300}
                height={300}
                className="object-contain cursor-pointer md:w-72 w-48"
                onClick={() => router.push("/all-products")}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ==== Desktop Arrows ==== */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        ›
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-button" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
