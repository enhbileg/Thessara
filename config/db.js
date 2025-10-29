import mongoose from "mongoose";

let cached = global.mongoose;

// Хэрвээ өмнө кэш үүсээгүй бол шинээр үүсгэнэ
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  // Хэрвээ өмнө холбогдсон байвал тэрийг шууд ашиглана
  if (cached.conn) return cached.conn;

  // MONGODB_URI шалгах
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("❌ MONGODB_URI environment variable not set!");
  }

  // Холболтын сонголтууд
  const opts = {
    bufferCommands: false,
    dbName: "thessara_db", // өөрийн DB нэрийг энд тохируул
    maxPoolSize: 10, // олон хүсэлт дээр connection pool ашиглана
    minPoolSize: 1,
    serverSelectionTimeoutMS: 10000, // timeout 10 секунд
  };

  // Хэрвээ өмнө promise үүсээгүй бол шинэ холболт үүсгэнэ
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // дахин оролдох боломж олгоно
    throw err;
  }

  return cached.conn;
}
