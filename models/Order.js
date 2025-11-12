// models/order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    items: [
      {
        product: { type: String, required: true, ref: "product" },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true, ref: "address" },

    // Payment & delivery statuses for dynamic UI and workflows
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
      required: true,
    },

    status: { type: String, default: "Order Placed", required: true },
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
