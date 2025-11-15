import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";
import Address from "@/models/address";

export async function GET(request) {
    try {
        const {userId} = getAuth(request)
        await connectDB()
        const addresses = await Address.find({userId})
        return NextResponse.json({ success: true, addresses }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}