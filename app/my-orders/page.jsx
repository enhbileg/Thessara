'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import axios from "axios";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders(data.orders.reverse());
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <h2 className="text-lg font-medium mt-6 mb-6">My Orders</h2>
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="relative bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col gap-4 border border-gray-200"
              >
                {/* ✅ Status badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-20">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/70 text-white">
                    {order.deliveryStatus}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/70 text-white">
                    {order.paymentStatus}
                  </span>
                </div>

                {/* ✅ Product image + quantity */}
                <div className="flex flex-col items-start">
                  {order.items[0]?.product?.image ? (
                    <Image
                      className="w-20 h-20 object-cover rounded mb-2"
                      src={
                        Array.isArray(order.items[0].product.image)
                          ? order.items[0].product.image[0]
                          : order.items[0].product.image
                      }
                      alt={order.items[0].product.name}
                      width={80}
                      height={80}
                    />
                  ) : (
                    <Image
                      className="w-20 h-20 object-cover rounded mb-2"
                      src={assets.box_icon}
                      alt="box_icon"
                      width={80}
                      height={80}
                    />
                  )}
                  <span className="text-xs text-gray-600">
                    Items: {order.items.length}
                  </span>
                </div>

                {/* ✅ Product names */}
                <div className="text-sm font-medium">
                  {order.items
                    .map(
                      (item) => item.product.name + ` x ${item.quantity}`
                    )
                    .join(", ")}
                </div>

                {/* ✅ Address */}
                <div className="text-xs text-gray-600">
                  <p className="font-medium">{order.address.fullName}</p>
                  <p>{order.address.area}</p>
                  <p>{`${order.address.city}, ${order.address.state}`}</p>
                  <p>{order.address.phoneNumber}</p>
                </div>

                {/* ✅ Amount */}
                <p className="font-semibold text-specialText">
                  {currency}
                  {Number(order.amount).toLocaleString("mn-MN")}
                </p>

                {/* ✅ Other info */}
                <div className="text-xs text-gray-600 flex flex-col gap-1">
                  <span>Method: COD</span>
                  <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
