"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setOrdersByDate(data.ordersByDate);
        setDeliveryStatus(data.deliveryStatus);
        setPaymentStatus(data.paymentStatus);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
        <Card title="Orders" value={summary.orders} />
        <Card title="Sales" value={`₮ ${Number(summary.sales || 0).toLocaleString("mn-MN")}`} />
        <Card title="Users" value={summary.users} />
        <Card title="Products" value={summary.products} />
        <Card title="Total Stock" value={summary.totalStock} />
        <Card title="Unique Customers" value={summary.uniqueCustomers} />
        <Card title="Total Sold" value={summary.totalSold} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Growth */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow">
          <h2 className="font-medium mb-2">Orders Growth (7 days)</h2>
          <Line
            data={{
              labels: ordersByDate.map(o => o.date),
              datasets: [
                {
                  label: "Orders",
                  data: ordersByDate.map(o => o.count),
                  borderColor: "#7c3aed",
                  backgroundColor: "rgba(124,58,237,0.2)",
                  tension: 0.3,
                },
                {
                  label: "Sales",
                  data: ordersByDate.map(o => o.amount),
                  borderColor: "#10b981",
                  backgroundColor: "rgba(16,185,129,0.2)",
                  tension: 0.3,
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>

        {/* Delivery Status (only Paid orders) */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow h-64">
          <h2 className="font-medium mb-2">Delivery Status</h2>
          <Pie
            data={{
              labels: Object.keys(deliveryStatus),
              datasets: [
                {
                  data: Object.values(deliveryStatus),
                  backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
                },
              ],
            }}
            options={{ maintainAspectRatio: false, responsive: true }}
          />
        </div>

        {/* Payment Status (all orders) */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow h-64">
          <h2 className="font-medium mb-2">Payment Status</h2>
          <Pie
            data={{
              labels: Object.keys(paymentStatus),
              datasets: [
                {
                  data: Object.values(paymentStatus),
                  backgroundColor: ["#f59e0b", "#10b981", "#ef4444"], // Pending, Paid, Failed
                },
              ],
            }}
            options={{ maintainAspectRatio: false, responsive: true }}
          />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-900 p-4 rounded shadow text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold">{value ?? 0}</p>
  </div>
);

export default Dashboard;
