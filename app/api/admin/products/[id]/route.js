// app/api/admin/products/[id]/route.js
import connectDB from "@/config/db";
import { NextResponse } from "next/server";
import Product from "@/models/product";

export async function GET(req, { params }) {
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, product });
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const product = await Product.findByIdAndUpdate(params.id, body, { new: true });
  if (!product) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, product });
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true, message: "Deleted" });
}
