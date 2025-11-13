import connectDB from "@/config/db";
import Settings from "@/models/Settings";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// ✅ Get settings
export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne();

    if (!settings) {
      // анх удаа бол хоосон settings үүсгэнэ
      settings = new Settings({});
      await settings.save();
    }

    return NextResponse.json({ success: true, settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ Update settings
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();

    // шууд object массив хадгална
    const update = { ...body };
    
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(update);
      await settings.save();
      console.log("settings created:", update);
    } else {
      settings = await Settings.findOneAndUpdate(
        { _id: settings._id },
        { $set: update },
        { new: true },
        console.log("settings updated:", settings._id, update)
      );
    }

    return NextResponse.json({ success: true, settings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

