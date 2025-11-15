import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    await connectDB();

    // ✅ бүх хэрэглэгчийн messages массивыг хоосолно
    await User.updateMany({}, { $set: { messages: [] } });

    return NextResponse.json(
      { success: true, message: "All history cleared" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
