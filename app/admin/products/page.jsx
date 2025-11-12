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
      const { data } = await axios.delete(`/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
            <button
              onClick={() => router.push("/admin/products/add")}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
            >
              ➕ Add Product
            </button>
          </div>

          {/* ✅ Responsive Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition"
              >
                {/* Image */}
                <div className="overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image[0]}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover transform hover:scale-105 transition"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-orange-600 font-bold mt-2">
                    ₮{product.offerPrice}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 p-4 border-t">
                  <button
                    onClick={() =>
                      router.push(`/admin/products/${product._id}/edit`)
                    }
                    className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    🗑️ Delete
                  </button>
                  <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="flex-1 px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
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
