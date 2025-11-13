"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function FeaturedProductsSettings({ onBack }) {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/product/list", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setProducts(data.products || []);
    };

    const fetchSettings = async () => {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setSelected(data.settings.featuredProducts || []);
      }
    };

    fetchProducts();
    fetchSettings();
  }, []);

  const toggle = (p) => {
    setSelected((s) =>
      s.find((item) => item.id === p._id)
        ? s.filter((item) => item.id !== p._id)
        : [...s, { id: p._id, name: p.name }]
    );
  };

  const save = async () => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featuredProducts: selected }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      toast.success("Featured products updated!");
      setSelected(data.settings.featuredProducts || []);
    } else {
      toast.error(data.message || "Update failed");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">⭐ Featured Products</h2>
      <p className="text-sm text-gray-500">Онцлох барааг эндээс сонгоно.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => {
          const isSelected = selected.find((item) => item.id === p._id);
          return (
            <div
              key={p._id}
              onClick={() => toggle(p)}
              className={`border rounded p-3 cursor-pointer transition ${
                isSelected ? "bg-purple-100 border-purple-500" : "hover:bg-gray-50"
              }`}
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-600">₮ {p.offerPrice}</p>
              {isSelected && <span className="text-xs text-purple-600">Selected</span>}
            </div>
          );
        })}
      </div>

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
