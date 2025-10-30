import Address from "@/models/address"
import Order from "@/models/Order"
import Product from "@/models/product"
import { NextResponse } from "next/server"
import connectDB from "@/config/db"
import { getAuth } from "@clerk/nextjs/server"



export async function GET(request) {
    try {
        const {userId} = getAuth(request)

        await connectDB()

        Address.length
        Product.length

        const orders = await Order.find({userId}).populate('address items.product')

        return NextResponse.json({ success: true, orders }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }}