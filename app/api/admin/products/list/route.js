import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Product from "@/models/product";
import authSeller from "@/lib/authSeller"; // ✅ seller эсвэл admin эрх шалгах

export async function GET(req) {
  try {
    // ✅ Clerk authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Seller эсвэл Admin эрх шалгах
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Access" },
        { status: 403 }
      );
    }

    // ✅ DB холболт
    await connectDB();

    // ✅ Бүх бүтээгдэхүүнийг татах
    const products = await Product.find({ userId }).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
