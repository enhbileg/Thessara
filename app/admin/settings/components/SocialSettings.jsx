"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function SocialSettings({ onBack }) {
  const [form, setForm] = useState({ facebook: "", instagram: "", twitter: "" });

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/admin/settings");
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
  }, []);

  const save = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ socialLinks: form }),
    });
    const data = await res.json();
    if (res.ok && data.success) toast.success("Social links updated!");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">🌐 Social Links</h2>
      <div className="space-y-4">
        <input name="facebook" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} placeholder="Facebook URL" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500" />
        <input name="instagram" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="Instagram URL" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500" />
        <input name="twitter" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} placeholder="Twitter URL" className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500" />
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={save} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Update</button>
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">⬅ Back</button>
      </div>
    </div>
  );
}
