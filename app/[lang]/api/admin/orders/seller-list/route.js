import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// ✅ Seller orders list
export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ userId }).sort({ date: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Fetch orders error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
