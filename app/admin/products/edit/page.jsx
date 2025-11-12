"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const EditProductPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken, user } = useAppContext();

  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);

  // хуучин мэдээлэл тусдаа хадгална
  const [oldProduct, setOldProduct] = useState(null);

  // шинэ мэдээлэл form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Earphone",
    price: "",
    offerPrice: "",
    stock: "",
  });

  // ✅ Fetch product
  const fetchProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/products/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const product = data.products.find((p) => p._id === id);
      if (!product) return toast.error("Product not found");

      setOldProduct(product); // хуучин мэдээлэл
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
      toast.error("Failed to fetch product");
    }
  };

  // ✅ Update product
  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const { data } = await axios.put(
        "/api/admin/products/update",
        { id, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Product updated successfully");
        router.push("/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Update failed");
      console.error(error);
    }
  };

  useEffect(() => {
    if (user && id) fetchProduct();
  }, [user, id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-primary p-6">
      <h2 className="text-2xl font-bold text-primary mb-6">✏️ Edit Product</h2>

      <form
        onSubmit={updateProduct}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl"
      >
        {/* Зүүн тал: хуучин мэдээлэл */}
        <div className="bg-backBanner p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-primary mb-4">Before Info</h3>
          <p>Name: {oldProduct?.name}</p>
          <p>Description: {oldProduct?.description}</p>
          <p>Category: {oldProduct?.category}</p>
          <p>Price: ₮{oldProduct?.price}</p>
          <p>Offer Price: ₮{oldProduct?.offerPrice}</p>
          <p>Stock: {oldProduct?.stock}</p>
        </div>

        {/* Баруун тал: шинэ мэдээлэл */}
        <div className="bg-backBanner p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-primary mb-4">Update Info</h3>

          {["name", "description", "category", "price", "offerPrice", "stock"].map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-base font-medium capitalize">{field}</label>
              {field === "description" ? (
                <textarea
                  rows={3}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none"
                />
              ) : field === "category" ? (
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="outline-none py-2 px-3 rounded border border-gray-500/40"
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
                  className="outline-none py-2 px-3 rounded border border-gray-500/40"
                />
              )}
            </div>
          ))}
        </div>

        {/* Save Changes button center */}
        <div className="col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            💾 Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
