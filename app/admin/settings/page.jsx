"use client";
import { useState, useEffect } from "react";
import GeneralSettings from "./components/GeneralSettings";
import ContactSettings from "./components/ContactSettings";
import SocialSettings from "./components/SocialSettings";
import SliderSettings from "./components/SliderSettings";
import FeaturedProducts from "./components/FeaturedSettings";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [active, setActive] = useState("");
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (res.ok && data.success) {
          setSettings(data.settings);
        } else {
          toast.error(data.message);
        }
      } catch {
        toast.error("Failed to load settings");
      }
    };
    fetchSettings();
  }, []);

  if (!settings) return <p>Loading...</p>;

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ Admin Settings</h1>

      {!active && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button onClick={() => setActive("general")} className="px-4 py-2 border rounded">General</button>
          <button onClick={() => setActive("contact")} className="px-4 py-2 border rounded">Contact</button>
          <button onClick={() => setActive("social")} className="px-4 py-2 border rounded">Social</button>
          <button onClick={() => setActive("slider")} className="px-4 py-2 border rounded">Slider</button>
          <button onClick={() => setActive("featured")} className="px-4 py-2 border rounded">Featured</button>
        </div>
      )}

      {active === "general" && <GeneralSettings initial={settings} onBack={() => setActive("")} />}
      {active === "contact" && <ContactSettings initial={settings} onBack={() => setActive("")} />}
      {active === "social" && <SocialSettings initial={settings} onBack={() => setActive("")} />}
      {active === "slider" && <SliderSettings initial={settings} onBack={() => setActive("")} />}
      {active === "featured" && <FeaturedProducts initial={settings} onBack={() => setActive("")} />}
    </section>
  );
}
