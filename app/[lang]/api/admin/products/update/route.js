import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import { inngest } from "@/config/inngest";

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Access" },
        { status: 401 }
      );
    }

    // ✅ JSON body авна
    const body = await request.json();
    const { id, name, description, category, price, offerPrice, stock } = body;

    // ✅ Inngest event рүү илгээнэ
    await inngest.send({
      name: "product/update",
      data: {
        id,
        userId,
        name,
        description,
        category,
        price: Number(price),
        offerPrice: Number(offerPrice),
        stock: Number(stock),
      },
    });
    
    return NextResponse.json({
      success: true,
      message: "Product update dispatched to Inngest",
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
