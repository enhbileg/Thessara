"use client";

import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import Footer from "@/components/seller/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { getDictionary } from "@/app/[lang]/dictionaries.js";

const StatusBadge = ({ status, type }) => {
  const colors = {
    payment: {
      Pending: "bg-yellow-100 text-yellow-700",
      Paid: "bg-green-100 text-green-700",
      Failed: "bg-red-100 text-red-700",
    },
    delivery: {
      Pending: "bg-gray-100 text-gray-700",
      Shipped: "bg-blue-100 text-blue-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
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

const OrderDetailContent = () => {
  const { getToken, user, language } = useAppContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dict, setDict] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  // ✅ Dictionary ачаалах
  useEffect(() => {
    (async () => {
      const d = await getDictionary(language);
      setDict(d);
    })();
  }, [language]);

  const fetchOrder = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `/${language}/api/admin/orders/detail?id=${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setOrder(data.order);
        setLoading(false);
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(dict.fetchFailed || "Failed to fetch order");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && orderId) fetchOrder();
  }, [user, orderId]);

  if (loading) return <Loading />;
  if (!order) return <div className="p-10">{dict.orderNotFound || "Order not found"}</div>;

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="w-full md:p-10 p-4">
        <button
          onClick={() => router.push(`/${language}/admin/orders`)}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          {dict.backToOrders || "← Back to Orders"}
        </button>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {dict.orderDetails || "Order Details"}
          </h2>
          <div className="flex gap-3">
            <StatusBadge status={order.paymentStatus} type="payment" />
            <StatusBadge status={order.deliveryStatus} type="delivery" />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {dict.generalInfo || "General Info"}
          </h3>
          <p><strong>{dict.orderId || "Order ID"}:</strong> {order._id}</p>
          <p><strong>{dict.amount || "Amount"}:</strong> ₮{order.amount}</p>
          <p><strong>{dict.date || "Date"}:</strong> {new Date(order.date).toLocaleString()}</p>
          {order.address && (
            <div className="mt-4">
              <h4 className="font-semibold mb-1">
                {dict.shippingAddress || "Shipping Address"}
              </h4>
              <p><b>Нэр: </b>{order.address.fullName}</p>
              <p><b>Утасны дугаар: </b>{order.address.phoneNumber}</p>
              <p>
               <b>Хаяг: </b>{order.address.city} хот, {order.address.district} дүүрэг, {order.address.state}-р хороо, {order.address.compoundBuilding} байр, {order.address.apartment} тоот</p>
              <p><b>{dict.Notes || "Notes"}: </b>{order.address.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">
            {dict.items || "Items"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 border rounded-lg p-3 hover:shadow-md transition"
              >
                <img
                  src={item.productImage || "/placeholder.png"}
                  alt={item.productName || "Product"}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    {dict.quantity || "Quantity"}: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    {dict.price || "Price"}: ₮{item.productOfferPrice || item.productPrice}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// ✅ Suspense wrapper
export default function OrderDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrderDetailContent />
    </Suspense>
  );
}
