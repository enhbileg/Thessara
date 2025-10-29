import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Thessara" });
// inngesteer database ruugaa useree hadgalah function
export const syncUserCreation = inngest.createFunction(
    {
        id: 'Sync-user-from-clerk'
    },
    {
        event: 'clerk/user.created'
    },
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _Id: id,
            name: first_name + '' + last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)
    }
    )
    // inngesteer databased bga useruudiiha medeelelee shinechleh function
export const syncUserUpdation = inngest.createFunction(
    {
        id: 'update-user-from-clerk'
    },
    {
        event: 'clerk/user.updated'
    },
    async ({event}) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            name: first_name + '' + last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

// inngesteer useriiha datag ustgah function
export const syncUserDeletion = inngest.createFunction(
    {
        id: 'delete-user-from-clerk'
    },
    {
        event: 'clerk/user.deleted'
    },
    async ({event}) => {
        const { id } = event.data
        await connectDB()
        await User.findByIdAndDelete(id)
    }
)

    