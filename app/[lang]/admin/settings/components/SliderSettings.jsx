"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext"; 
import { getDictionary } from "@/app/[lang]/dictionaries.js"; 

export default function SliderSettings({ onBack }) {
  const { language } = useAppContext();
  const [slides, setSlides] = useState([]);
  const [dict, setDict] = useState({});


  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/${language}/api/admin/settings`);
        const data = await res.json();
        if (res.ok && data.success) {
          setSlides(data.settings.slider || []);
        }
      } catch {
        toast.error(dict.sliderLoadFailed || "Failed to load slider settings");
      }
    };
    fetchSettings();
  }, [language]);

  const onChange = (i, field, value) => {
    const newSlides = [...slides];
    newSlides[i][field] = value;
    setSlides(newSlides);
  };

  const addSlide = () =>
    setSlides([
      ...slides,
      { title: "", offer: "", buttonText1: "", buttonText2: "", imgSrc: "" },
    ]);

  const save = async () => {
    try {
      const res = await fetch(`/${language}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slider: slides }),
      });
      const data = await res.json();
      if (res.ok && data.success) toast.success(dict.sliderUpdated || "Slider updated!");
      else toast.error(data.message);
    } catch {
      toast.error(dict.sliderSaveFailed || "Failed to save slider");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        {dict.sliderSettings || "🖼 Slider Settings"}
      </h2>
      <p className="text-sm text-gray-500">
        {dict.sliderSettingsDesc || "Manage homepage slider images, text, and buttons here."}
      </p>

      {slides.map((s, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <h3 className="font-medium text-gray-700">
            {dict.slide || "Slide"} {i + 1}
          </h3>
          <input
            value={s.title}
            onChange={(e) => onChange(i, "title", e.target.value)}
            placeholder={dict.title || "Title"}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
          <input
            value={s.offer}
            onChange={(e) => onChange(i, "offer", e.target.value)}
            placeholder={dict.offer || "Offer"}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
          <input
            value={s.buttonText1}
            onChange={(e) => onChange(i, "buttonText1", e.target.value)}
            placeholder={dict.buttonText1 || "Button Text 1"}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
          <input
            value={s.buttonText2}
            onChange={(e) => onChange(i, "buttonText2", e.target.value)}
            placeholder={dict.buttonText2 || "Button Text 2"}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
          <input
            value={s.imgSrc}
            onChange={(e) => onChange(i, "imgSrc", e.target.value)}
            placeholder={dict.imageUrl || "Image URL"}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      ))}

      <button
        onClick={addSlide}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        {dict.addSlide || "➕ Add Slide"}
      </button>

      <div className="flex gap-3 mt-6">
        <button
          onClick={save}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          {dict.update || "Update"}
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          {dict.back || "⬅ Back"}
        </button>
      </div>
    </div>
  );
}
