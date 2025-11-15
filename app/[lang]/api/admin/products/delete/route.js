import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

export async function DELETE(request) {
  try {
    console.log("📩 Incoming DELETE request...");

    const { userId } = getAuth(request);
    console.log("✅ Clerk userId:", userId);

    const isSeller = await authSeller(userId);
    console.log("👤 Is seller:", isSeller);

    if (!isSeller) {
      console.log("❌ Unauthorized access attempt!");
      return NextResponse.json(
        { success: false, message: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // 🔎 request.url‑ээс ID авах
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // /api/product/delete?id=123
    console.log("🆔 Product ID from request:", id);

    if (!id) {
      console.log("❌ No product ID provided!");
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    console.log("✅ Connected to DB");

    const product = await Product.findById(id);
    console.log("🔎 Product found:", product);

    if (!product) {
      console.log("❌ Product not found in DB!");
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.userId !== userId) {
      console.log("❌ Seller mismatch! product.userId:", product.userId);
      return NextResponse.json(
        { success: false, message: "You cannot delete this product" },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(id);
    console.log("🗑️ Product deleted successfully:", id);

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
