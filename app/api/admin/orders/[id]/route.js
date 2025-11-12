import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { inngest } from "@/config/inngest";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connectDB();
  const order = await Order.findById(params.id);
  if (!order) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  return NextResponse.json({ success: true, order });
}

export async function PUT(req, { params }) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  await connectDB();
  const payload = await req.json();
  const { paymentStatus, deliveryStatus } = payload;

  const order = await Order.findById(params.id);
  if (!order) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });

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
}

export async function DELETE(req, { params }) {
  await connectDB();
  const deleted = await Order.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  return NextResponse.json({ success: true, message: "Order deleted" });
}
