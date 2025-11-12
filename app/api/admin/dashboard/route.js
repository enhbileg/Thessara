// app/api/admin/dashboard/route.js
import connectDB from "@/config/db";
import Product from "@/models/product";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  await connectDB();

  const orders = await Order.find({});
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();

  // Summary
  const summary = {
    orders: orders.length,
    sales: orders.reduce((sum, o) => sum + o.amount, 0),
    users: usersCount,
    products: productsCount,
  };

  // Orders by date (сүүлийн 7 хоног)
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recentOrders = orders.filter(o => o.date >= sevenDaysAgo);

  const ordersByDateMap = {};
  recentOrders.forEach(o => {
    const day = new Date(o.date).toLocaleDateString("mn-MN");
    if (!ordersByDateMap[day]) ordersByDateMap[day] = { count: 0, amount: 0 };
    ordersByDateMap[day].count += 1;
    ordersByDateMap[day].amount += o.amount;
  });

  const ordersByDate = Object.entries(ordersByDateMap).map(([date, val]) => ({
    date,
    ...val,
  }));

  // Orders status
  const ordersStatus = {};
  orders.forEach(o => {
    ordersStatus[o.status] = (ordersStatus[o.status] || 0) + 1;
  });

  return Response.json({ summary, ordersByDate, ordersStatus });
}
