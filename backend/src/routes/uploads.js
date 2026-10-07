import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadDir = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, Date.now() + "-" + safe);
  },
});

const IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO = ["video/mp4", "video/webm", "video/quicktime"];

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max (videos)
  fileFilter: (req, file, cb) => {
    if (IMAGE.includes(file.mimetype) || VIDEO.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only images (jpg/png/webp/gif) and videos (mp4/webm/mov) are allowed"));
  },
});

// POST /api/uploads — admin only, field name "file" → { url }
router.post("/", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file received" });
  res.status(201).json({ url: `/uploads/${req.file.filename}`, type: req.file.mimetype });
});

// Upload errors → clean JSON instead of HTML crash page
router.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message });
  next();
});

export default router;
