import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileName: String,
  description: String,
  owner: String,
  algorithm: String,
  encryptedData: String,
  size: Number,
  encryptionTime: Number,
  decryptionTime: Number,
  sharedWith: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);
