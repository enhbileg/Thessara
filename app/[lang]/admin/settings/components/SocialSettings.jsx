"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext"; 
import { getDictionary } from "@/app/[lang]/dictionaries.js"; 

export default function SocialSettings({ onBack }) {
  const { language } = useAppContext();
  const [form, setForm] = useState({ facebook: "", instagram: "", twitter: "" });
  const [dict, setDict] = useState({});


  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);


  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch(`/${language}/api/admin/settings`);
      const data = await res.json();
      if (res.ok && data.success) {
        setForm({
          facebook: data.settings.socialLinks?.facebook || "",
          instagram: data.settings.socialLinks?.instagram || "",
          twitter: data.settings.socialLinks?.twitter || "",
        });
      }
    };
    fetchSettings();
  }, [language]);

  const save = async () => {
    const res = await fetch(`/${language}/api/admin/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ socialLinks: form }),
    });
    const data = await res.json();
    if (res.ok && data.success) toast.success(dict.socialUpdated || "Social links updated!");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        {dict.socialSettings || "🌐 Social Links"}
      </h2>
      <div className="space-y-4">
        <input
          name="facebook"
          value={form.facebook}
          onChange={(e) => setForm({ ...form, facebook: e.target.value })}
          placeholder={dict.facebookUrl || "Facebook URL"}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="instagram"
          value={form.instagram}
          onChange={(e) => setForm({ ...form, instagram: e.target.value })}
          placeholder={dict.instagramUrl || "Instagram URL"}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
        />
        <input
          name="twitter"
          value={form.twitter}
          onChange={(e) => setForm({ ...form, twitter: e.target.value })}
          placeholder={dict.twitterUrl || "Twitter URL"}
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={save}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {dict.update || "Update"}
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          {dict.back || "⬅ Back"}
        </button>
      </div>
    </div>
  );
}
