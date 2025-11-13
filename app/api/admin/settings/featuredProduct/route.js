import connectDB from "@/config/db";
import featuredProducts from "@/models/Settings";
import { NextResponse } from "next/server";

// ✅ GET – бүх featured products
export async function GET() {
  try {
    await connectDB();
    const products = await featuredProducts.find();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ✅ PUT – шинэчилж хадгалах
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ success: false, message: "Invalid data format" }, { status: 400 });
    }

    // ✅ өмнөх бүх featured products‑ийг устгана
    await featuredProducts.deleteMany({});

    // ✅ шинэ object массивыг хадгална
    await featuredProducts.insertMany(body);

    const updated = await featuredProducts.find();
    return NextResponse.json({ success: true, products: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
