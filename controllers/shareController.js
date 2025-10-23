import { Share } from "../models/Share.js";
import { User } from "../models/User.js";
import { File } from "../models/File.js";

export const shareFile = async (req, res) => {
  const { fileId, recipient } = req.body;
  const receiver = await User.findOne({ username: recipient });
  if (!receiver) return res.status(404).json({ message: "Recipient not found" });

  await Share.create({
    file: fileId,
    sender: req.user._id,
    recipient: receiver._id,
  });

  res.json({ message: "File shared successfully" });
};
