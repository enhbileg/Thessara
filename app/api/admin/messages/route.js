// app/api/admin/messages/route.js
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    // Зөвхөн мессеж үлдээсэн хэрэглэгчид
    const users = await User.find({ "messages.0": { $exists: true } })
      .select("name email messages");

    // Зөвхөн reply хийгдээгүй мессежүүдийг шүүж авна
    const filteredUsers = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      messages: u.messages.filter((m) => !m.reply),
    })).filter((u) => u.messages.length > 0);

    return NextResponse.json({ success: true, users: filteredUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
