// app/api/admin/messages/history/route.js
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({ "messages.0": { $exists: true } })
      .select("name email messages");

    // Зөвхөн reply хийгдсэн мессежүүд
    const historyUsers = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      messages: u.messages.filter((m) => m.reply),
    })).filter((u) => u.messages.length > 0);

    return NextResponse.json({ success: true, users: historyUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
