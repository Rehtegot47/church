import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/content — public { key: value }
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT `key`, value FROM site_content");
    res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// PUT /api/content — admin { key, value } (upsert)
router.put("/", requireAdmin, async (req, res) => {
  const { key, value } = req.body || {};
  if (!key) return res.status(400).json({ error: "Key is required" });
  try {
    await pool.query(
      "INSERT INTO site_content (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)",
      [key, value || ""]
    );
    res.json({ key, value: value || "" });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

export default router;
