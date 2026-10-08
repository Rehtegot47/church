import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Cloudinary mode (production: Render + TiDB). Set CLOUDINARY_URL or the trio below.
// Disk mode (local dev): files land in backend/uploads/ and are served at /uploads/...
const useCloud = !!(
  process.env.CLOUDINARY_URL ||
  (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
);

if (useCloud) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!useCloud) fs.mkdirSync(uploadDir, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, Date.now() + "-" + safe);
  },
});

const IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO = ["video/mp4", "video/webm", "video/quicktime"];

const upload = multer({
  storage: useCloud ? multer.memoryStorage() : diskStorage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max (videos)
  fileFilter: (req, file, cb) => {
    if (IMAGE.includes(file.mimetype) || VIDEO.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Only images (jpg/png/webp/gif) and videos (mp4/webm/mov) are allowed"));
  },
});

function uploadBufferToCloudinary(buffer, mimetype, originalname) {
  const isVideo = VIDEO.includes(mimetype);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: isVideo ? "video" : "image", folder: "grace-ville", public_id: `${Date.now()}-${originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_")}` },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    stream.end(buffer);
  });
}

// POST /api/uploads — admin only, field name "file" → { url }
router.post("/", requireAdmin, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file received" });
  try {
    if (useCloud) {
      const url = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype, req.file.originalname);
      return res.status(201).json({ url, type: req.file.mimetype });
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}`, type: req.file.mimetype });
  } catch (e) {
    res.status(500).json({ error: "Upload failed: " + e.message });
  }
});

// Upload errors → clean JSON instead of HTML crash page
router.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message });
  next();
});

export default router;
