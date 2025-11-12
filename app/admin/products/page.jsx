"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const ProductList = () => {
  const { router, getToken, user } = useAppContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/product/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/admin/products/delete?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      if (data.success) {
        toast.success(data.message);
        setProducts(products.filter((p) => p._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchSellerProduct();
  }, [user]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-primary transition-colors duration-300">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">My Products</h2>
            <button
              onClick={() => router.push("/admin/products/add")}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
            >
              ➕ Add Product
            </button>
          </div>

          {/* ✅ Card Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-backBanner rounded-lg shadow-md hover:shadow-xl transition flex flex-col"
              >
                {/* Image */}
                <div className="overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image[0]}
                    alt={product.name}
                    width={200}
                    height={150}
                    className="w-full h-28 object-cover transform hover:scale-105 transition"
                  />
                </div>

                {/* Info */}
                <div className="p-2 flex-1">
                  <h3 className="text-sm font-semibold truncate text-primary">
                    {product.name}
                  </h3>
                  <p className="text-xs text-primary">{product.category}</p>
                  <p className="text-orange-600 font-bold mt-1 text-sm">
                    ₮{product.offerPrice}
                  </p>
                  {/* ✅ Stock info */}
                  <p className="text-xs text-primary mt-1">
                    Stock: {product.stock}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 p-2 border-t border-navbar">
                  <button
                    onClick={() =>
                      router.push(`/admin/products/edit?id=${product._id}`)
                    }
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-xs"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-xs"
                  >
                    👁️ View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
