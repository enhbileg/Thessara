"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import Footer from "@/components/seller/Footer";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const { getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders(data.orders);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const updateOrder = async (id, payload) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        "/api/admin/orders/update",
        { id, ...payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Order updated");
        setOrders((prev) => prev.map((o) => (o._id === id ? data.order : o)));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const deleteOrder = async (id) => {
    try {
      const token = await getToken();
      const { data } = await axios.delete("/api/admin/orders/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      if (data.success) {
        toast.success(data.message);
        setOrders((prev) => prev.filter((o) => o._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const goToDetail = (id) => {
    router.push(`/admin/orders/detail?id=${id}`);
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  // ✅ Group orders
  const placedOrders = orders.filter((o) => o.status === "Order Placed");
  const paymentPending = orders.filter((o) => o.paymentStatus === "Pending");
  const paidOrders = orders.filter(
    (o) => o.paymentStatus === "Paid" && o.deliveryStatus === "Pending"
  );
  const shippedOrders = orders.filter((o) => o.deliveryStatus === "Shipped");
  const deliveredOrders = orders.filter((o) => o.deliveryStatus === "Delivered");

  const StatusBadge = ({ order }) => {
    let color = "bg-gray-100 text-primary";
    let text = order.deliveryStatus;
    if (order.status === "Order Placed") {
      color = "bg-purple-100 text-primary";
      text = "Order Placed";
    } else if (order.paymentStatus === "Pending") {
      color = "bg-yellow-100 text-primary";
      text = "Payment Pending";
    } else if (order.deliveryStatus === "Shipped") {
      color = "bg-blue-100 text-primary";
    } else if (order.deliveryStatus === "Delivered") {
      color = "bg-green-100 text-primary";
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
        {text}
      </span>
    );
  };

  const Section = ({ title, list, renderActions }) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-primary mb-4">{title}</h3>
      <div className="overflow-hidden rounded-lg bg-backBanner shadow-md transition-colors duration-300">
        {/* Desktop table */}
        <table className="hidden md:table table-fixed w-full">
          <thead className="bg-backBanner text-primary text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Delivery</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-primary">
            {list.map((order) => (
              <tr
                key={order._id}
                onClick={() => goToDetail(order._id)}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <td className="px-4 py-3">{order._id}</td>
                <td className="px-4 py-3 text-orange-600 font-semibold">
                  ₮{order.amount}
                </td>
                <td className="px-4 py-3">{order.paymentStatus}</td>
                <td className="px-4 py-3">{order.deliveryStatus}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {renderActions(order)}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteOrder(order._id);
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="md:hidden">
          {list.map((order) => (
            <div
              key={order._id}
              onClick={() => goToDetail(order._id)}
              className="bg-backBanner rounded-lg shadow-md p-4 mb-3 relative cursor-pointer transition-colors duration-300"
            >
              <div className="absolute top-2 right-2">
                <StatusBadge order={order} />
              </div>
              <p className="font-semibold text-primary">
                Order ID: {order._id}
              </p>
              <p className="text-orange-600 font-bold">₮{order.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
return (
  <div className="flex-1 min-h-screen flex flex-col justify-between bg-primary">
    {loading ? (
      <Loading />
    ) : (
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-6 text-2xl font-bold text-primary">Orders</h2>

        <Section
          title="📝 Order Placed"
          list={placedOrders}
          renderActions={(o) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateOrder(o._id, { paymentStatus: "Paid" });
              }}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Mark as Paid
            </button>
          )}
        />

        <Section
          title="💳 Payment Pending"
          list={paymentPending}
          renderActions={(o) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateOrder(o._id, { paymentStatus: "Paid" });
              }}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Mark as Paid
            </button>
          )}
        />

        <Section
          title="✅ Paid Orders"
          list={paidOrders}
          renderActions={(o) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateOrder(o._id, { deliveryStatus: "Shipped" });
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Ship Order
            </button>
          )}
        />

        <Section
          title="📦 Shipped Orders"
          list={shippedOrders}
          renderActions={(o) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateOrder(o._id, { deliveryStatus: "Delivered" });
              }}
              className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
            >
              Mark as Delivered
            </button>
          )}
        />

        <Section
          title="🎉 Delivered Orders"
          list={deliveredOrders}
          renderActions={() => (
            <span className="text-green-600 font-medium">Completed</span>
          )}
        />
      </div>
    )}
    <Footer />
  </div>
);
};

export default OrdersPage;
