"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

const AddProduct = () => {
  const { getToken, language } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Earphone");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [stock, setStock] = useState("");
  const [dict, setDict] = useState({});

  // ✅ Dictionary ачаалах
  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("stock", stock);

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(`/${language}/api/product/add`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(dict.addedSuccess || "Product added successfully!");
        setFiles([]);
        setName("");
        setDescription("");
        setCategory("Earphone");
        setPrice("");
        setOfferPrice("");
        setStock("");
      } else {
        toast.error(data.message || dict.addedFailed || "Failed to add product");
      }
    } catch (error) {
      toast.error(dict.addedFailed || "Failed to add product");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">
          {dict.addNewProduct || "Add New Product"}
        </h1>

        {/* Image Upload */}
        <div>
          <p className="text-base font-medium">
            {dict.productImages || "Product Images"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
            {[...Array(4)].map((_, index) => (
              <label
                key={index}
                htmlFor={`image${index}`}
                className="cursor-pointer border rounded-lg flex items-center justify-center h-24 bg-gray-100 hover:bg-gray-200"
              >
                <input
                  type="file"
                  id={`image${index}`}
                  hidden
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                />
                <Image
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index])
                      : assets.upload_area
                  }
                  alt="Upload"
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="product-name">
            {dict.productName || "Product Name"}
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none py-2 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="product-description">
            {dict.productDescription || "Product Description"}
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none py-2 px-3 rounded border border-gray-300 resize-none focus:ring-2 focus:ring-orange-500"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        {/* Category, Price, Offer Price, Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="category">
              {dict.category || "Category"}
            </label>
            <select
              id="category"
              className="outline-none py-2 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Earphone">Earphone</option>
              <option value="Headphone">Headphone</option>
              <option value="Watch">Watch</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Laptop">Laptop</option>
              <option value="Camera">Camera</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="product-price">
              {dict.productPrice || "Product Price"}
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="offer-price">
              {dict.offerPrice || "Offer Price"}
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>

          {/* ✅ Stock */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="stock">
              {dict.stock || "Stock"}
            </label>
            <input
              id="stock"
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-gray-300 focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
        >
          {dict.addProduct || "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
