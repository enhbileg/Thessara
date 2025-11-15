"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext"; 
import { getDictionary } from "@/app/[lang]/dictionaries.js"; 

export default function GeneralSettings({ onBack }) {
  const { language } = useAppContext();
  const [form, setForm] = useState({
    siteName: "",
    supportEmail: "",
    preferredTheme: "light",
    notifications: false,
  });
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
          siteName: data.settings.siteName || "",
          supportEmail: data.settings.supportEmail || "",
          preferredTheme: data.settings.preferredTheme || "light",
          notifications: data.settings.notifications || false,
        });
      }
    };
    fetchSettings();
  }, [language]);

  const save = async () => {
    const res = await fetch(`/${language}/api/admin/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok && data.success) toast.success(dict.generalUpdated || "General settings updated!");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {dict.generalSettings || "🛠 General Settings"}
        </h2>
        <p className="text-sm text-gray-500">
          {dict.generalSettingsDesc || "Site basic settings"}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {dict.siteName || "Site Name"}
          </label>
          <input
            name="siteName"
            value={form.siteName}
            onChange={(e) => setForm({ ...form, siteName: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {dict.supportEmail || "Support Email"}
          </label>
          <input
            name="supportEmail"
            value={form.supportEmail}
            onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {dict.preferredTheme || "Preferred Theme"}
          </label>
          <select
            name="preferredTheme"
            value={form.preferredTheme}
            onChange={(e) => setForm({ ...form, preferredTheme: e.target.value })}
            className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="light">{dict.light || "Light"}</option>
            <option value="dark">{dict.dark || "Dark"}</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.notifications}
            onChange={() => setForm({ ...form, notifications: !form.notifications })}
            className="h-4 w-4 text-purple-600 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">
            {dict.enableNotifications || "Enable Notifications"}
          </label>
        </div>
      </div>

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
