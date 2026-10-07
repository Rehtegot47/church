import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// GET /api/sunday-media/current — media for the current church week
// (latest week_start on or before today, so it lasts till next Sunday)
router.get("/current", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM sunday_media WHERE week_start <= CURDATE() ORDER BY week_start DESC, id ASC LIMIT 50"
    );
    if (!rows.length) return res.json({ week_start: null, items: [] });
    const week = rows[0].week_start;
    res.json({ week_start: week, items: rows.filter(r => r.week_start === week) });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// GET /api/sunday-media/weeks — distinct weeks, newest first
router.get("/weeks", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT week_start FROM sunday_media ORDER BY week_start DESC");
    res.json(rows.map(r => r.week_start));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// GET /api/sunday-media?week=YYYY-MM-DD — admin
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { week } = req.query;
    const [rows] = week
      ? await pool.query("SELECT * FROM sunday_media WHERE week_start = ? ORDER BY id ASC", [week])
      : await pool.query("SELECT * FROM sunday_media ORDER BY week_start DESC, id ASC LIMIT 200");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// POST /api/sunday-media — admin { week_start, kind: image|video, url, caption }
router.post("/", requireAdmin, async (req, res) => {
  const { week_start, kind, url, caption } = req.body || {};
  if (!week_start || !url) return res.status(400).json({ error: "Week and file are required" });
  if (kind && !["image", "video"].includes(kind)) return res.status(400).json({ error: "Kind must be image or video" });
  try {
    const [result] = await pool.query(
      "INSERT INTO sunday_media (week_start, kind, url, caption) VALUES (?, ?, ?, ?)",
      [week_start, kind || "image", url, caption || ""]
    );
    const [rows] = await pool.query("SELECT * FROM sunday_media WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// DELETE /api/sunday-media/:id — admin
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM sunday_media WHERE id = ?", [req.params.id]);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

export default router;
