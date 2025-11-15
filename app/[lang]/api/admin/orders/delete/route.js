import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Seller эсэхийг шалгана
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Forbidden: Only sellers allowed" }, { status: 403 });
    }

    await connectDB();
    const { id } = await req.json();

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
