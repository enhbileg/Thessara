import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { inngest } from "@/config/inngest";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

export async function PUT(req) {
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
    const { id, paymentStatus, deliveryStatus } = await req.json();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (deliveryStatus) order.deliveryStatus = deliveryStatus;
    await order.save();

    // ✅ Inngest trigger
    if (paymentStatus === "Paid") {
      await inngest.send({ name: "order/payment.done", data: { orderId: order._id.toString(), amount: order.amount, userId: order.userId } });
    }
    if (deliveryStatus === "Shipped") {
      await inngest.send({ name: "order/shipped", data: { orderId: order._id.toString() } });
    }
    if (deliveryStatus === "Delivered") {
      await inngest.send({ name: "order/delivery.done", data: { orderId: order._id.toString() } });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
