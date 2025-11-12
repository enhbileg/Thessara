import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/product";
import { inngest } from "@/config/inngest";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "invalid data" },
        { status: 401 }
      );
    }

    // ✅ Amount тооцоолох
    const amount = await items.reduce(async (accPromise, item) => {
      const acc = await accPromise;
      const product = await Product.findById(item.product);
      return acc + product.offerPrice * item.quantity;
    }, Promise.resolve(0));

    // ✅ Stock хасах
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Not enough stock for ${product.name}` },
          { status: 400 }
        );
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // ✅ Inngest event илгээх
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + 5000, // жишээ хүргэлтийн төлбөр
        paymentStatus: "Pending",
        deliveryStatus: "Pending",
        status: "Order Placed",
        date: Date.now(),
      },
    });

    // ✅ Cart хоослох
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json(
      { success: true, message: "Order created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
