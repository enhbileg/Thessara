// app/api/admin/orders/events/view/route.js
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { inngest } from "@/config/inngest";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const isSeller = await authSeller(userId);
    if (!isSeller) return NextResponse.json({ success: false, message: "Forbidden: Only sellers allowed" }, { status: 403 });

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ success: false, message: "Order ID required" }, { status: 400 });

    await inngest.send({
      name: "order/viewed",
      data: { orderId, viewerId: userId, at: new Date().toISOString() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
