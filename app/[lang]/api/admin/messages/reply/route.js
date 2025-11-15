// app/api/admin/messages/reply/route.js
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { userId, messageId, reply } = await request.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const message = user.messages.id(messageId); // ✅ Subdocument _id ашиглана
    if (!message) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    message.reply = reply;
    message.repliedAt = new Date();
    await user.save();

    return NextResponse.json({ success: true, message: "Reply saved" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
