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
  const [ordersStatus, setOrdersStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setSummary(data.summary);
      setOrdersByDate(data.ordersByDate);
      setOrdersStatus(data.ordersStatus);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Top summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card title="Orders" value={summary.orders} />
        <Card title="Sales" value={`₮ ${summary.sales?.toLocaleString("mn-MN")}`} />
        <Card title="Users" value={summary.users} />
        <Card title="Products" value={summary.products} />
      </div>

      {/* Middle section: Growth chart + Status chart хажуу талдаа */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  backgroundColor: "#7c3aed",
                },
                {
                  label: "Sales",
                  data: ordersByDate.map(o => o.amount),
                  borderColor: "#10b981",
                  backgroundColor: "#10b981",
                },
              ],
            }}
          />
        </div>

        {/* Order Status */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded shadow h-64">
          <h2 className="font-medium mb-2">Order Status</h2>
          <Pie
            data={{
              labels: Object.keys(ordersStatus),
              datasets: [
                {
                  data: Object.values(ordersStatus),
                  backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              responsive: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-900 p-4 rounded shadow text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default Dashboard;
