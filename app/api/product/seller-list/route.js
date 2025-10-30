import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import Product from "@/models/product";
import connectDB from "@/config/db";

export async function GET(request) {
    try {
        const { userId  } = getAuth(request)
        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized Access" }, { status: 401 })
        }
        await connectDB()


        const products = await Product.find({})
        return NextResponse.json({ success: true, products }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}