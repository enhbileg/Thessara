import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";
import User from "@/models/User";


export async function GET(request) {
    try {
        const { userID } = getAuth(request)
        await connectDB()
        const user = await User.findById(userID)
        const { cartItems } = user
        return NextResponse.json({ success: true, cartItems: user.cartItems }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })   
    }
}