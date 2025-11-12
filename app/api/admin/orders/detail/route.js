import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import Address from "@/models/address";
import Product from "@/models/product"; // ✅ Product model import
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Only sellers allowed" },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    let order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ Address lookup
    if (order.address) {
      const addr = await Address.findById(order.address);
      if (addr) {
        order = order.toObject();
        order.address = addr;
      }
    }

    // ✅ Product lookup for each item
    if (order.items && order.items.length > 0) {
      const itemsWithProduct = await Promise.all(
        order.items.map(async (item) => {
          const prod = await Product.findById(item.product);
          return {
            ...item,
            productName: prod ? prod.name : "Unknown",
            productImage: prod ? prod.image[0] : null,
            productPrice: prod ? prod.price : null,
            productOfferPrice: prod ? prod.offerPrice : null,
          };
        })
      );
      order.items = itemsWithProduct;
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Order detail error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
