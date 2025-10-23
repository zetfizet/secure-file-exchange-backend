import { File } from "../models/File.js";
import { encryptFile, decryptFile } from "../utils/encryption.js";

export const uploadFile = async (req, res) => {
  const { algorithm } = req.body;
  const key = process.env.SECRET_KEY || "mysecretkey";

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const { encrypted, time } = encryptFile(req.file.buffer, key, algorithm);
    const newFile = await File.create({
      originalName: req.file.originalname,
      encryptedData: encrypted,
      algorithm,
      size: req.file.size,
      owner: req.user._id,
      performance: { encryptionTime: time },
    });

    res.status(201).json({ message: "File encrypted & uploaded", file: newFile });
  } catch (err) {
    res.status(500).json({ message: "Encryption failed" });
  }
};

export const getAllFiles = async (req, res) => {
  const files = await File.find({ owner: req.user._id });
  res.json(files);
};

export const getPerformance = async (req, res) => {
  const files = await File.find({}, "algorithm performance size");
  const data = files.map((f) => ({
    algorithm: f.algorithm,
    encryptionTime: f.performance.encryptionTime.toFixed(2),
    decryptionTime: f.performance.decryptionTime?.toFixed(2) || 0,
    sizeKB: (f.size / 1024).toFixed(2),
  }));
  res.json(data);
};
