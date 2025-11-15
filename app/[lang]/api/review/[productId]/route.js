import connectDB from "@/config/db";
import Review from "@/models/Review";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// ✅ Get reviews
export async function GET(req, context) {
  try {
    await connectDB();
    const { productId } = await context.params;

    const reviews = await Review.find({ productId }).lean();

    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({ success: true, reviews, averageRating: avg });
  } catch (error) {
    console.error("Review GET error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ✅ Add review
export async function POST(req, context) {
  try {
    await connectDB();
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await context.params;
    const body = await req.json();
    console.log(body)
    const review = await Review.create({
      productId,
      userId,                 // Clerk ID хадгална
      userName: body.userName,        // ✅ Frontend‑ээс ирсэн name
      userImageUrl: body.userImageUrl,// ✅ Frontend‑ээс ирсэн imageUrl
      rating: body.rating,
      comment: body.comment,
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
