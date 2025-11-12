"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import Footer from "@/components/seller/Footer";

const Badge = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${tones[tone]}`}>{children}</span>
  );
};

const OrdersPage = () => {
  const { getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders(data.orders);
        setLoading(false);
      } else {
        toast.error(data.message || "Failed to load orders");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load orders");
    }
  };

  const updateOrder = async (id, payload) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(`/api/admin/orders/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Order updated");
        setOrders((prev) => prev.map((o) => (o._id === id ? data.order : o)));
      } else {
        toast.error(data.message || "Failed to update");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update");
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  // Simple search by ID or address string
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((o) => {
      const idMatch = String(o._id).toLowerCase().includes(term);
      const addrMatch = String(o.address || "").toLowerCase().includes(term);
      return idMatch || addrMatch;
    });
  }, [q, orders]);

  // Grouping by statuses
  const paymentPending = filtered.filter((o) => o.paymentStatus === "Pending");
  const paidAwaitingShip = filtered.filter(
    (o) => o.paymentStatus === "Paid" && o.deliveryStatus === "Pending"
  );
  const shipped = filtered.filter((o) => o.deliveryStatus === "Shipped");
  const delivered = filtered.filter((o) => o.deliveryStatus === "Delivered");

  const Section = ({ title, list, renderActions }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">{list.length} orders</span>
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <table className="table-fixed w-full">
          <thead className="bg-gray-100 text-gray-900 text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Delivery</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {list.map((o) => (
              <tr key={o._id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{o._id}</span>
                    {o.address && (
                      <span className="text-xs text-gray-500 truncate max-w-[280px]">
                        {o.address}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-orange-600 font-semibold">₮{o.amount}</td>
                <td className="px-4 py-3">
                  {o.paymentStatus === "Pending" && <Badge tone="yellow">Pending</Badge>}
                  {o.paymentStatus === "Paid" && <Badge tone="green">Paid</Badge>}
                </td>
                <td className="px-4 py-3">
                  {o.deliveryStatus === "Pending" && <Badge tone="gray">Pending</Badge>}
                  {o.deliveryStatus === "Shipped" && <Badge tone="blue">Shipped</Badge>}
                  {o.deliveryStatus === "Delivered" && <Badge tone="green">Delivered</Badge>}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-500">
                    {o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    {renderActions(o)}
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
                  No orders in this section.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
            <div className="flex items-center gap-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by Order ID or address..."
                className="px-3 py-2 w-64 border rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={fetchOrders}
                className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 text-sm"
              >
                Refresh
              </button>
            </div>
          </div>

          <Section
            title="💳 Payment pending"
            list={paymentPending}
            renderActions={(o) => (
              <button
                onClick={() => updateOrder(o._id, { paymentStatus: "Paid" })}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Mark as Paid
              </button>
            )}
          />

          <Section
            title="✅ Paid (awaiting shipment)"
            list={paidAwaitingShip}
            renderActions={(o) => (
              <button
                onClick={() => updateOrder(o._id, { deliveryStatus: "Shipped" })}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Ship Order
              </button>
            )}
          />

          <Section
            title="📦 Shipped"
            list={shipped}
            renderActions={(o) => (
              <button
                onClick={() => updateOrder(o._id, { deliveryStatus: "Delivered" })}
                className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
              >
                Mark as Delivered
              </button>
            )}
          />

          <Section
            title="🎉 Delivered"
            list={delivered}
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
