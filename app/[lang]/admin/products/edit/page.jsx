"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

const EditProductContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken, user, language } = useAppContext();

  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [dict, setDict] = useState({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Earphone",
    price: "",
    offerPrice: "",
    stock: "",
  });

  // ✅ Dictionary ачаалах
  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  // ✅ Fetch product
  const fetchProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/${language}/api/admin/products/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const product = data.products.find((p) => p._id === id);
      if (!product) return toast.error(dict.productNotFound || "Product not found");

      setForm({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        offerPrice: product.offerPrice,
        stock: product.stock || 0,
      });
      setLoading(false);
    } catch (error) {
      toast.error(dict.fetchFailed || "Failed to fetch product");
    }
  };

  // ✅ Update product
  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `/${language}/api/admin/products/update`,
        { id, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(dict.updateSuccess || "Product updated successfully");
        router.push(`/${language}/admin/products`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(dict.updateFailed || "Update failed");
      console.error(error);
    }
  };

  useEffect(() => {
    if (user && id) fetchProduct();
  }, [user, id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">
        {dict.editProduct || "✏️ Edit Product"}
      </h2>

      {/* ✅ Form голд байрлана */}
      <form
        onSubmit={updateProduct}
        className="w-full max-w-2xl mx-auto space-y-4 bg-backBanner p-6 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-primary mb-4">
          {dict.updateInfo || "Update Info"}
        </h3>

        {["name", "description", "category", "price", "offerPrice", "stock"].map((field) => (
          <div key={field} className="flex flex-col gap-1">
            <label className="text-base font-medium capitalize">{field}</label>
            {field === "description" ? (
              <textarea
                rows={3}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="outline-none py-2 px-3 rounded border bg-backBanner border-gray-500/40 resize-none"
              />
            ) : field === "category" ? (
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="outline-none py-2 px-3 rounded border bg-backBanner border-gray-500/40"
              >
                <option value="Earphone">Earphone</option>
                <option value="Headphone">Headphone</option>
                <option value="Watch">Watch</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Camera">Camera</option>
                <option value="Accessories">Accessories</option>
              </select>
            ) : (
              <input
                type={["price", "offerPrice", "stock"].includes(field) ? "number" : "text"}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="outline-none py-2 px-3 bg-backBanner rounded border border-gray-500/40"
              />
            )}
          </div>
        ))}

        {/* Save Changes button center */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {dict.saveChanges || "💾 Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ✅ Suspense wrapper
export default function EditProductPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EditProductContent />
    </Suspense>
  );
}
