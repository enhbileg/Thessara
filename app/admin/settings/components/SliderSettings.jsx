"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function SliderSettings({ onBack }) {
  const [slides, setSlides] = useState([]);

  // ✅ API‑аас settings авч populate хийнэ
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (res.ok && data.success) {
          setSlides(data.settings.slider || []);
        }
      } catch {
        toast.error("Failed to load slider settings");
      }
    };
    fetchSettings();
  }, []);

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
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slider: slides }),
      });
      console.log(slides);
      const data = await res.json();
      if (res.ok && data.success) toast.success("Slider updated!");
      else toast.error(data.message);
    } catch {
      toast.error("Failed to save slider");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">🖼 Slider Settings</h2>
      <p className="text-sm text-gray-500">
        Homepage дээр гарч буй slider‑ийн зураг, текст, товчнуудыг эндээс удирдана.
      </p>

      {slides.map((s, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <h3 className="font-medium text-gray-700">Slide {i + 1}</h3>
          <input
            value={s.title}
            onChange={(e) => onChange(i, "title", e.target.value)}
            placeholder="Title"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
          <input
            value={s.offer}
            onChange={(e) => onChange(i, "offer", e.target.value)}
            placeholder="Offer"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
          <input
            value={s.buttonText1}
            onChange={(e) => onChange(i, "buttonText1", e.target.value)}
            placeholder="Button Text 1"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
          <input
            value={s.buttonText2}
            onChange={(e) => onChange(i, "buttonText2", e.target.value)}
            placeholder="Button Text 2"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
          <input
            value={s.imgSrc}
            onChange={(e) => onChange(i, "imgSrc", e.target.value)}
            placeholder="Image URL"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      ))}

      <button
        onClick={addSlide}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        ➕ Add Slide
      </button>

      <div className="flex gap-3 mt-6">
        <button
          onClick={save}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          
        >
          Update
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}
