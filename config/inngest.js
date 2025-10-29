import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

export const inngest = new Inngest({ id: "Thessara" });

// create user
export const syncUserCreation = inngest.createFunction(
  { id: 'Sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    const userData = {
      _id: id,
      name: first_name + '' + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url
    }
    await connectDB();

    // давхар email check
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      await User.create(userData);
    }
  }
);

// update user
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      name: first_name + '' + last_name,
      email: email_addresses[0].email_address,
      imageUrl: image_url
    }
    await connectDB();

    await User.findByIdAndUpdate(id, userData)
  }
);

// delete user
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();

    await User.findByIdAndDelete(id);
  }
);
