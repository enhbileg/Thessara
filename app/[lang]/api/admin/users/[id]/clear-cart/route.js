import connectDB from "@/config/db";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function PUT(req, context) {
  try {
    await connectDB();

    // params нь Promise тул await хийж задлана
    const { id } = await context.params;

    // Clerk id эсвэл Mongo ObjectId аль алинд нь шалгана
    let user = await User.findOne({ clerkId: id });
    if (!user) {
      user = await User.findById(id);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // cartItems‑ийг хоослох
    user.cartItems = {};
    await user.save();

    return NextResponse.json(
      { success: true, message: "Cart cleared successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
