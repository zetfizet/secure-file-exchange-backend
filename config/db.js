import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/secure_file_exchange");
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ Database connection failed", err.message);
    process.exit(1);
  }
};
