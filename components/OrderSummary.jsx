"use client";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

const OrderSummary = () => {
  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    getToken,
    user,
    cartItems,
    setCartItems,
    language,
  } = useAppContext();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [dict, setDict] = useState({});

  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  const fetchUserAddresses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/${language}/api/user/get-address`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error(dict.pleaseSelectAddress || "Please select an address");
      }

      let cartItemsArray = Object.keys(cartItems).map((key) => ({
        product: key,
        quantity: cartItems[key],
      }));
      cartItemsArray = cartItemsArray.filter((item) => item.quantity > 0);

      if (cartItemsArray.length === 0) {
        return toast.error(dict.emptyCart || "Your cart is empty");
      }

      const token = await getToken();

      const { data } = await axios.post(
        `/${language}/api/order/create`,
        {
          address: selectedAddress._id,
          items: cartItemsArray,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setCartItems({});
        router.push(`/${language}/order-placed`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user]);

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        {dict.orderSummary || "Order Summary"}
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            {dict.selectAddress || "Select Address"}
          </label>
          <div className="relative inline-block w-full text-sm border-blank">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-blank text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
              {selectedAddress
              ? `${selectedAddress.city}, ${selectedAddress.district}, ${selectedAddress.state}, ${selectedAddress.compoundBuilding}, ${selectedAddress.apartment}`
              : dict.selectAddress || "Select Address"}
              </span>

              <svg
                className={`w-5 h-5 inline float-right transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-0" : "-rotate-90"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-backBanner shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                  onClick={() => handleAddressSelect(address)}
                  >
                  {address.fullName}, {address.phoneNumber},
                  {address.city}, {address.district}, {address.state}, 
                  {address.compoundBuilding}, {address.apartment}
                   
                </li>
                ))}
                <li
                  onClick={() => router.push(`/${language}/add-address`)}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  {dict.addNewAddress || "+ Add New Address"}
                </li>
              </ul>
            )}
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">
              {dict.items || "Items"} {getCartCount()}
            </p>
            <p className="text-gray-800">
              {currency}{getCartAmount().toLocaleString("mn-MN")}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">{dict.shippingFee || "Shipping Fee"}</p>
            <p className="font-medium text-gray-800">5,000₮</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>{dict.total || "Total"}</p>
            <p>
              {currency}{Math.floor(getCartAmount() + 5000).toLocaleString("mn-MN")}
            </p>
          </div>
        </div>
      </div>
      <div className="pt-10">
        <button
          onClick={createOrder}
          className="w-full pt-2 pb-2 bg-button text-primary rounded-full"
        >
          {dict.placeOrder || "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
