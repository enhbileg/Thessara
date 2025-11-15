"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter , usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDictionary } from "@/app/[lang]/dictionaries"; // ✅ dictionary loader

export const AppContext = createContext(null);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const initialLang = pathname.split("/")[1] || "mn";
  const [language, setLanguage] = useState(initialLang); 
  const [dictionary, setDictionary] = useState({});

  // ✅ Product fetch
  const fetchProductData = async () => {
    try {
      const { data } = await axios.get(`/${language}/api/product/list`);
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ User fetch
  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === "seller") {
        setIsSeller(true);
      }
      const token = await getToken();
      const { data } = await axios.get(`/${language}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Add to cart
  const addToCart = async (itemId, stock) => {
    let cartData = structuredClone(cartItems);
    const currentQty = cartData[itemId] || 0;

    if (currentQty + 1 > stock) {
      toast.error("Out of stock");
      return;
    }

    cartData[itemId] = currentQty + 1;
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post(`/${language}/api/cart/update`, { cartData }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Item added to cart");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // ✅ Update cart quantity
  const updateCartQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post(`/${language}/api/cart/update`, { cartData }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cart updated successfully");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // ✅ Cart count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  // ✅ Cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const id in cartItems) {
      const itemInfo = products.find((p) => p._id === id);
      if (itemInfo) {
        totalAmount += itemInfo.offerPrice * cartItems[id];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  // ✅ Update product
  const updateProduct = async (id, updatedData) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `/${language}/api/product/update?id=${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Product updated successfully");
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, ...updatedData } : p))
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Delete product
  const deleteProduct = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.delete(
        `/${language}/api/product/delete?id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Translate function → dictionary ашиглаж
  const translate = (key) => {
    return dictionary[key] || key;
  };

  // ✅ Dictionary ачаалах
  useEffect(() => {
    (async () => {
      const dict = await getDictionary(language);
      setDictionary(dict);
    })();
  }, [language]);

   // ✅ Product fetch хэл солигдох бүрт
  useEffect(() => {
    fetchProductData();
  }, [language]);

  // ✅ User fetch хэл болон user солигдох бүрт
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user, language]);

  const languages = ["mn", "en"];

  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const newLang = languages[nextIndex];

    setLanguage(newLang);

    // ✅ URL‑ийн эхний segment‑ийг шинэ хэлээр солих
    const segments = pathname.split("/");
    segments[1] = newLang;
    const newPath = segments.join("/");

    router.push(newPath);
  };


  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    updateProduct,
    deleteProduct,
    language,
    setLanguage,
    translate,
    toggleLanguage,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
