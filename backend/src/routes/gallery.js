import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/gallery — public
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, url, caption, category FROM gallery ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// POST /api/gallery — admin
router.post("/", requireAdmin, async (req, res) => {
  const { url, caption, category } = req.body || {};
  if (!url || !caption) return res.status(400).json({ error: "Image URL and caption are required" });
  try {
    const [result] = await pool.query("INSERT INTO gallery (url, caption, category) VALUES (?, ?, ?)", [url, caption, category || "Service"]);
    res.status(201).json({ id: result.insertId, url, caption, category: category || "Service" });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// DELETE /api/gallery/:id — admin
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM gallery WHERE id = ?", [req.params.id]);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

export default router;
