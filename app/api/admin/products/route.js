// app/api/admin/products/route.js
import connectDB from "@/config/db";
import { NextResponse } from "next/server";
import Product from "@/models/product";

// GET: бүх бүтээгдэхүүн
export async function GET() {
  await connectDB();
  const products = await Product.find();
  return NextResponse.json({ success: true, products });
}

// POST: шинэ бүтээгдэхүүн нэмэх
export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const product = new Product(body);
  await product.save();
  return NextResponse.json({ success: true, product }, { status: 201 });
}
