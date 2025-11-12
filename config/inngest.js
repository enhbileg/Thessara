import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/product";

export const inngest = new Inngest({ id: "Thessara" })

// create user
export const syncUserCreation = inngest.createFunction(
  { id: 'Sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data
    const userData = {
      _id: id,
      name: first_name + '' + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url
    }
    await connectDB()
    await User.create(userData)
  }
)

// update user
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data

    const userData = {
      _id: id,
      name: first_name + '' + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url
    }
    await connectDB();

    await User.findByIdAndUpdate(id, userData)
  }
)

// delete user
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data
    await connectDB()

    await User.findByIdAndDelete(id)
  }
)

// inngesteer hereglegchiin zahialgiig uusgeh 

export const createUserOrder = inngest.createFunction(
  {
    id: 'create-user-order',
    batchEvents:{
      maxSize: 5,
      timeout: '5s'
    }
  },
  {
    event: 'order/created'
  },
  async ({events}) => {

    const orders = events.map((event) => {
      return {
        userId: event.data.userId,
        items: event.data.items,
        amount: event.data.amount,
        address: event.data.address,
        date: event.data.date,
      }
    })

    await connectDB()
    await Order.insertMany(orders)

    return{ success: true, processed: events.length}

  }
)
// Төлбөр хийгдсэн үед
export const onPaymentDone = inngest.createFunction(
  { id: "on-payment-done" },
  { event: "order/payment.done" },
  async ({ event }) => {
    console.log("💳 Payment done:", event.data.orderId);
    // Email/SMS/Notification logic энд
    return { ok: true };
  }
);

// Хүргэлт эхэлсэн үед
export const onOrderShipped = inngest.createFunction(
  { id: "on-order-shipped" },
  { event: "order/shipped" },
  async ({ event }) => {
    console.log("📦 Order shipped:", event.data.orderId);
    // Warehouse notification logic энд
    return { ok: true };
  }
);

// Хүргэлт дууссан үед
export const onOrderDelivered = inngest.createFunction(
  { id: "on-order-delivered" },
  { event: "order/delivery.done" },
  async ({ event }) => {
    console.log("✅ Order delivered:", event.data.orderId);
    // Customer notification logic энд
    return { ok: true };
  }
);
// барааний шинэчлэлт
export const productUpdate = inngest.createFunction(
  { id: "product-update" },
  { event: "product/update" },
  async ({ event }) => {
    const { id, name, description, category, price, offerPrice, stock } = event.data;

    await connectDB();
    const updated = await Product.findByIdAndUpdate(
      id,
      { name, description, category, price, offerPrice, stock },
      { new: true }
    );
    

    return { success: true, updated };
  }
);