"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import Footer from "@/components/seller/Footer";
import { useSearchParams, useRouter } from "next/navigation";

const StatusBadge = ({ status, type }) => {
  const colors = {
    payment: {
      Pending: "bg-yellow-100 text-yellow-700",
      Paid: "bg-green-100 text-green-700",
    },
    delivery: {
      Pending: "bg-gray-100 text-gray-700",
      Shipped: "bg-blue-100 text-blue-700",
      Delivered: "bg-green-100 text-green-700",
    },
  };
  return (
    <span
      className={`px-3 py-1 rounded text-sm font-medium ${
        colors[type][status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

const OrderDetailPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { getToken, user } = useAppContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrder = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/admin/orders/detail",
        { id: orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setOrder(data.order);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch order");
    }
  };

  useEffect(() => {
    if (user && orderId) fetchOrder();
  }, [user, orderId]);

  if (loading) return <Loading />;
  if (!order) return <div className="p-10">Order not found</div>;

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="w-full md:p-10 p-4">
        {/* Back button */}
        <button
          onClick={() => router.push("/admin/orders")}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          ← Back to Orders
        </button>

        {/* Desktop view */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
            <div className="flex gap-3">
              <StatusBadge status={order.paymentStatus} type="payment" />
              <StatusBadge status={order.deliveryStatus} type="delivery" />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">General Info</h3>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Amount:</strong> ₮{order.amount}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

            {order.address && (
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Shipping Address</h4>
                <p>{order.address.fullName}</p>
                <p>{order.address.phoneNumber}</p>
                <p>
                  {order.address.area}, {order.address.city}, {order.address.state}
                </p>
                <p>Pincode: {order.address.pincode}</p>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Items</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border rounded-lg p-3 hover:shadow-md transition"
                >
                  <img
                    src={item.product?.image?.[0] || "/placeholder.png"}
                    alt={item.product?.name || "Product"}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.product?.name || "Unknown"}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden">
          <div className="bg-white rounded-lg shadow-md p-4 relative">
            {/* Status badge top-right */}
            <div className="absolute top-2 right-2 flex gap-2">
              <StatusBadge status={order.paymentStatus} type="payment" />
              <StatusBadge status={order.deliveryStatus} type="delivery" />
            </div>

            <p className="font-semibold text-gray-800">Order ID: {order._id}</p>
            <p className="text-orange-600 font-bold">₮{order.amount}</p>
            <p className="text-sm text-gray-500">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {order.address && (
              <div className="mt-3 text-sm">
                <p className="font-semibold">Shipping Address</p>
                <p>{order.address.fullName}</p>
                <p>{order.address.phoneNumber}</p>
                <p>
                  {order.address.area}, {order.address.city}, {order.address.state}
                </p>
                <p>Pincode: {order.address.pincode}</p>
              </div>
            )}

            <div className="mt-4">
              <p className="font-semibold">Items</p>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 mt-2">
                  <img
                    src={item.product?.image?.[0] || "/placeholder.png"}
                    alt={item.product?.name || "Product"}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{item.product?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetailPage;
