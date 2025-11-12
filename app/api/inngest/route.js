import { serve } from "inngest/next";
import {
  createUserOrder,
  inngest,
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  onPaymentDone,
  onOrderShipped,
  onOrderDelivered,
  productUpdate
} from "@/config/inngest";

// Inngest API route
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // ✅ User events
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,

    // ✅ Order events
    createUserOrder,
    onPaymentDone,
    onOrderShipped,
    onOrderDelivered,

    // ✅ Product events
    productUpdate
  ],
});
