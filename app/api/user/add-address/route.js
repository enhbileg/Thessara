import Address from "@/models/address";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";


export async function POST(request) {
    try {
        const { userId  } = getAuth(request)
        const { address } = await request.json()

        await connectDB()
        const newAddress = await Address.create({
            ...address,userId
        })
        return NextResponse.json({ success: true, message: "Address added successfully", address: newAddress }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}