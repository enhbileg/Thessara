import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("name email imageUrl cartItems");
    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
