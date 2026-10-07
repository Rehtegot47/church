import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const ADMIN_EMAILS = ["rccggva@gmail.com", "admin@rccggraceville.org"];

// POST /api/auth/login { email, password }
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  const normalized = String(email).toLowerCase().trim();
  if (!ADMIN_EMAILS.includes(normalized)) return res.status(403).json({ error: "Access denied — not an admin email" });
  try {
    const [rows] = await pool.query("SELECT id, email, password_hash FROM admins WHERE email = ?", [normalized]);
    if (rows.length === 0) return res.status(401).json({ error: "No admin account with this email" });
    const ok = await bcrypt.compare(String(password), rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: "Wrong password" });
    const token = jwt.sign({ id: rows[0].id, email: rows[0].email }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "12h" });
    res.json({ token, email: rows[0].email });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// GET /api/auth/me
router.get("/me", requireAdmin, async (req, res) => {
  res.json({ id: req.admin.id, email: req.admin.email });
});

export default router;
