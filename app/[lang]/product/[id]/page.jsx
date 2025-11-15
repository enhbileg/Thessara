"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import ProductImageGallery from "@/components/Gallery";
import ProductCard from "@/components/ProductCard";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

const ProductPage = () => {
  const { id } = useParams();
  const { products, router, addToCart, language, getToken } = useAppContext();
  const [productData, setProductData] = useState(null);
  const [dict, setDict] = useState({});
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const { userData} = useAppContext();
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  const fetchProductData = () => {
    const product = products.find((p) => p._id === id);
    setProductData(product);
  };

  const fetchReviews = async () => {
    const { data } = await axios.get(`/${language}/api/review/${id}`);
    if (data.success) {
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [id, products.length]);
  const submitReview = async () => {
    const token = await getToken();
    await axios.post(
      `/${language}/api/review/${id}`,
      {
        rating: newRating,
        comment: newComment,
        userName: userData?.name,        // ✅ Frontend‑ээс дамжуулна
        userImageUrl: userData?.imageUrl // ✅ Frontend‑ээс дамжуулна
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewRating(0);
    setNewComment("");
    fetchReviews();
  };

  return productData ? (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <ProductImageGallery images={productData.image} interval={4000} />

          <div className="flex flex-col">
  <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
    {productData.name}
  </h1>

  {/* ✅ Dynamic rating */}
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Image
          key={i}
          className="h-4 w-4"
          src={i < Math.round(averageRating) ? assets.star_icon : assets.star_dull_icon}
          alt="star_icon"
        />
      ))}
    </div>
    <p>({averageRating.toFixed(1)})</p>
  </div>

  <p className="text-gray-600 mt-3">{productData.description}</p>

  {/* ✅ Category харуулах */}
  <p className="text-gray-700 mt-2">
    <span className="font-medium text-gray-800">Category:</span>{" "}
    {productData.category}
  </p>

  <p className="text-3xl font-medium mt-6">
    ₮{productData.offerPrice}
    <span className="text-base font-normal text-gray-800/60 line-through ml-2">
      ₮{productData.price}
    </span>
  </p>



            <hr className="bg-gray-600 my-6" />

            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={() => addToCart(productData._id, productData.stock)}
                className="w-full py-3.5 bg-nbutton"
              >
                {dict.addToCart || "Add to Cart"}
              </button>
              <button
                onClick={() => {
                  addToCart(productData._id, productData.stock);
                  router.push(`/${language}/cart`);
                }}
                className="w-full py-3.5 bg-button text-white transition"
              >
                {dict.buyNow || "Buy now"}
              </button>
            </div>
          </div>
        </div>

        {/* ==== Reviews Section ==== */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">{dict.reviews || "Reviews"}</h3>

          {/* Review form */}
          <div className="mb-6">
            <div className="flex gap-2 mb-2">
  {Array.from({ length: 5 }).map((_, i) => (
    <button
      key={i}
      onClick={() => setNewRating(i + 1)}
      onMouseEnter={() => setHoverRating(i + 1)}   
      onMouseLeave={() => setHoverRating(0)}       
      className={`h-6 w-6 ${
        i < (hoverRating || newRating) ? "text-yellow-400 scale-150" : "text-gray-400"
      }`}
    >
      ★
    </button>
  ))}
</div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={dict.WriteReviews || "Write your message"}
              className="w-full border rounded p-2 mb-2"
            />
            <button
              onClick={submitReview}
              className="px-4 py-2 bg-button text-white rounded"
            >
              {dict.submit || "Submit"}
            </button>
          </div>

          {/* ==== Review list ==== */}
          <div className="space-y-4">
  {reviews.map((r, idx) => (
    <div key={idx} className="border-b pb-2">
      <div className="flex items-center gap-3">
        {r.userImageUrl ? (
          <Image
            src={r.userImageUrl}
            alt={r.userName}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
            {r.userName ? r.userName.charAt(0) : "?"}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{r.userName || "Anonymous"}</span>
          <div className="flex items-center gap-2">
            {Array.from({ length: r.rating }).map((_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
            <span className="text-gray-600 text-sm">{r.rating}/5</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 mt-2">{r.comment}</p>
    </div>
  ))}
</div>
        </div>

        {/* ==== Featured Products ==== */}
        <div className="flex flex-col items-center mt-16">
  <p className="text-3xl font-medium">
    {dict.featuredProducts || "Featured Products"}
  </p>
  <div className="w-28 h-0.5 bg-button mt-2"></div>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
    {products
      .filter((p) => p._id !== productData._id) // ✅ Одоогийн барааг хасна
      .slice(0, 5)                              // ✅ Үлдсэнээс 5-г харуулна
      .map((p, i) => (
        <ProductCard key={i} product={p} />
      ))}
  </div>

  <button className="px-8 py-2 mb-16 rounded bg-button transition">
    {dict.seeMore || "See more"}
  </button>
</div>

      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ProductPage;
