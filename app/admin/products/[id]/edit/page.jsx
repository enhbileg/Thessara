"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    stock: 0,
    category: "",
    image: [],
    date: Date.now(),
  });

  const router = useRouter();
  const params = useParams();

  // 🔎 Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/admin/products/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setForm(data.product);
      } else {
        toast.error(data.message || "Failed to fetch product");
      }
    };
    fetchProduct();
  }, [params.id]);

  // 📝 Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } else {
      toast.error(data.message || "Failed to update product");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          placeholder="Offer Price"
          type="number"
          value={form.offerPrice}
          onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 w-full"
        />
        {/* Image array талбар */}
        <input
          placeholder="Image URLs (comma separated)"
          value={form.image.join(",")}
          onChange={(e) => setForm({ ...form, image: e.target.value.split(",") })}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}
