import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

export const inngest = new Inngest({ id: "Thessara" });

// 🧠 create user — duplicate хамгаалалттай
export const syncUserCreation = inngest.createFunction(
  { id: "Sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const email = email_addresses[0].email_address;

    await connectDB();

    // 🔹 1. Clerk эсвэл email давхацсан бол устгана
    await User.deleteMany({ $or: [{ clerkId: id }, { email }] });

    // 🔹 2. Дараа нь шинээр үүсгэнэ
    await User.create({
      clerkId: id,
      name: `${first_name} ${last_name}`,
      email,
      imageUrl: image_url,
    });
  }
);

// 🧠 update user — clerkId & email аль алинаар нь хайна
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const email = email_addresses[0].email_address;

    await connectDB();

    await User.findOneAndUpdate(
      { $or: [{ clerkId: id }, { email }] },
      {
        clerkId: id,
        name: `${first_name} ${last_name}`,
        email,
        imageUrl: image_url,
      },
      { upsert: true } // байхгүй бол шинээр үүсгэнэ
    );
  }
);

// 🧠 delete user — хоёуланг нь устгана
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.deleteMany({ $or: [{ clerkId: id }, { _id: id }] });
  }
);
