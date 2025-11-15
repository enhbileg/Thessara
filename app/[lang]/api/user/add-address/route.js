import Address from "@/models/address";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { address } = body;
    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address data missing" },
        { status: 400 }
      );
    }

    await connectDB();

    const newAddress = await Address.create({
      ...address,
      userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Address POST error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
