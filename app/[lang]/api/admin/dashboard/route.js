import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Access" },
        { status: 401 }
      );
    }

    await connectDB();

    // Orders count
    const orders = await Order.countDocuments();

    // Sales = sum of order.amount
    const salesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const sales = salesAgg[0]?.total || 0;

    // Users count
    const users = await User.countDocuments();

    // Products count
    const products = await Product.countDocuments();

    // Total stock
    const stockAgg = await Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: "$stock" } } },
    ]);
    const totalStock = stockAgg[0]?.totalStock || 0;

    // Unique customers
    const uniqueCustomersAgg = await Order.distinct("userId");
    const uniqueCustomers = uniqueCustomersAgg.length;

    // Total sold items
    const totalSoldAgg = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: null, totalSold: { $sum: "$items.quantity" } } },
    ]);
    const totalSold = totalSoldAgg[0]?.totalSold || 0;

    // Delivery status (only Paid orders)
    const deliveryStatusAgg = await Order.aggregate([
      { $match: { paymentStatus: "Paid", deliveryStatus: { $ne: null } } },
      { $group: { _id: "$deliveryStatus", count: { $sum: 1 } } },
    ]);
    const deliveryStatus = {};
    deliveryStatusAgg.forEach(d => {
      deliveryStatus[d._id] = d.count;
    });

    // Payment status (all orders)
    const paymentStatusAgg = await Order.aggregate([
      { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
    ]);
    const paymentStatus = {};
    paymentStatusAgg.forEach(p => {
      paymentStatus[p._id] = p.count;
    });

    // Orders growth (7 days)
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);

    const dateLabels = [];
    const dateMap = new Map();
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const label = d.toISOString().slice(0, 10);
      dateLabels.push(label);
      dateMap.set(label, { date: label, count: 0, amount: 0 });
    }

    const recentOrders = await Order.find({
      date: { $gte: start.getTime(), $lte: now.getTime() },
    }).lean();

    for (const o of recentOrders) {
      const label = new Date(o.date).toISOString().slice(0, 10);
      if (dateMap.has(label)) {
        const entry = dateMap.get(label);
        entry.count += 1;
        entry.amount += o.amount || 0;
        dateMap.set(label, entry);
      }
    }
    const ordersByDate = Array.from(dateMap.values());

    return NextResponse.json(
      {
        success: true,
        summary: {
          orders,
          sales,
          users,
          products,
          totalStock,
          uniqueCustomers,
          totalSold,
        },
        ordersByDate,
        deliveryStatus,
        paymentStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
