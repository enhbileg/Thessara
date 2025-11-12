import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/product";
import { inngest } from "@/config/inngest";
import User from "@/models/User";



export async function POST(request) {
    try {
        const { userId  } = getAuth(request)
        const { address, items } = await request.json()

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "invalid data" }, { status: 401 })
        }

        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return await acc + product.offerPrice * item.quantity;
        },0)

        await inngest.send({
            name: "order/created",
            data: { 
                userId, 
                address, 
                items, 
                amount: amount + Math.floor(amount + 5000),
                paymentStatus: "pending",
                deliveryStatus: "pending",
                status: "Order Placed",
                date:Date.now() }
        })

        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()

        return NextResponse.json({ success: true, message: "Order created successfully" }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
    }