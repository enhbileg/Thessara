import connectDB from "@/config/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function POST(req) {
  try {
    // ✅ Clerk authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Seller role шалгах
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Forbidden: Only sellers allowed" }, { status: 403 });
    }

    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Order ID required" }, { status: 400 });
    }

    // ✅ Order + Items + Address populate
    const order = await Order.findById(id)
      .populate("items.product")
      .populate("address");

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // ✅ createdAt зөв харагдах
    const formattedOrder = {
      ...order.toObject(),
      createdAt: order.createdAt ? order.createdAt.toISOString() : null,
    };

    return NextResponse.json({ success: true, order: formattedOrder });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
