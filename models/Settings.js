import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: "QuickCart" },
  supportEmail: { type: String, default: "support@quickcart.mn" },
  preferredTheme: { type: String, enum: ["light", "dark"], default: "light" },
  notifications: { type: Boolean, default: true },

  // ✅ Slider тохиргоо
  slider: [
    {
      title: String,
      offer: String,
      buttonText1: String,
      buttonText2: String,
      imgSrc: String,
    },
  ],
  // ✅ Featured Products тохиргоо
 featuredProducts: [
    {
      
      id:   String ,  // ✅ string хувилбар
      name:   String , // ✅ product name
    },
  ],


  // ✅ Бусад тохиргоо нэмэх боломжтой
  contactPhone: { type: String, default: "+976 8888-0000" },
  contactAddress: { type: String, default: "Ulaanbaatar, Mongolia" },
  workingHours: { type: String, default: "Mon-Fri: 9:00 AM – 6:00 PM" },

  // ✅ Дараа нь нэмэх боломжтой талбарууд
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
  },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
