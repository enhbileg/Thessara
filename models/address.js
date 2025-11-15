import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },

  city: { type: String, default: "Ulaanbaatar", required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },

  compoundBuilding: { type: String, required: true },
  apartment: { type: String, required: true },

  notes: { type: String },
}, { timestamps: true });

// ✅ Model name consistent
const Address = mongoose.models.address || mongoose.model("address", addressSchema);

export default Address;
