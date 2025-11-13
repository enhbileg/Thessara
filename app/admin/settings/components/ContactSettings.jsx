"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ContactSettings({ onBack }) {
  const [form, setForm] = useState({
    contactPhone: "",
    contactAddress: "",
    workingHours: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (res.ok && data.success) {
        setForm({
          contactPhone: data.settings.contactPhone || "",
          contactAddress: data.settings.contactAddress || "",
          workingHours: data.settings.workingHours || "",
        });
      }
    };
    fetchSettings();
  }, []);

  const save = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok && data.success) toast.success("Contact settings updated!");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">📞 Contact Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input name="contactPhone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input name="contactAddress" value={form.contactAddress} onChange={(e) => setForm({ ...form, contactAddress: e.target.value })} className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Working Hours</label>
          <input name="workingHours" value={form.workingHours} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} className="mt-1 w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={save} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Update</button>
        <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">⬅ Back</button>
      </div>
    </div>
  );
}
