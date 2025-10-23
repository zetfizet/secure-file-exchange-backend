import express from "express";
import multer from "multer";
import fs from "fs";
import File from "../models/File.js";
import { encryptData, decryptData } from "../utils/encryption.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { algorithm, description, user } = req.body;
    const filePath = req.file.path;

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { encrypted, time } = encryptData(fileContent, algorithm);

    const encryptedFile = new File({
      fileName: req.file.originalname,
      description,
      owner: user,
      algorithm,
      encryptedData: encrypted,
      size: Buffer.byteLength(encrypted, "utf8"),
      encryptionTime: time,
      decryptionTime: 0,
    });

    await encryptedFile.save();
    fs.unlinkSync(filePath);

    res.json({ message: "File uploaded and encrypted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// Share file
router.post("/share", async (req, res) => {
  try {
    const { fileId, recipient } = req.body;
    const file = await File.findById(fileId);

    if (!file.sharedWith.includes(recipient)) {
      file.sharedWith.push(recipient);
      await file.save();
    }

    res.json({ message: "File shared successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Share failed", error: err.message });
  }
});

// Download + decrypt file
router.post("/download", async (req, res) => {
  try {
    const { fileId, username } = req.body;
    const file = await File.findById(fileId);

    if (file.owner !== username && !file.sharedWith.includes(username)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { decrypted, time } = decryptData(file.encryptedData, file.algorithm);
    file.decryptionTime = time;
    await file.save();

    res.json({
      fileName: file.fileName,
      decryptedContent: decrypted,
      algorithm: file.algorithm,
      decryptionTime: time,
    });
  } catch (err) {
    res.status(500).json({ message: "Download failed", error: err.message });
  }
});

// Get all files for a user
router.get("/all/:username", async (req, res) => {
  const { username } = req.params;
  const files = await File.find({
    $or: [{ owner: username }, { sharedWith: username }],
  });
  res.json(files);
});

// Get performance data
router.get("/performance", async (req, res) => {
  const files = await File.find({});
  const grouped = {};

  files.forEach((f) => {
    if (!grouped[f.algorithm]) grouped[f.algorithm] = [];
    grouped[f.algorithm].push({
      encryptionTime: f.encryptionTime,
      decryptionTime: f.decryptionTime,
      size: f.size,
    });
  });

  res.json(grouped);
});

export default router;
