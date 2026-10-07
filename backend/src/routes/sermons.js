import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const toClient = (r) => ({
  id: r.id,
  title: r.title,
  pastor: r.pastor,
  date: r.date,
  youtube: r.youtube,
  category: r.category,
  desc: r.description,
});

// GET /api/sermons — public
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM sermons ORDER BY date DESC");
    res.json(rows.map(toClient));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// POST /api/sermons — admin
router.post("/", requireAdmin, async (req, res) => {
  const { title, pastor, date, youtube, category, desc } = req.body || {};
  if (!title || !pastor) return res.status(400).json({ error: "Title and minister are required" });
  try {
    const [result] = await pool.query(
      "INSERT INTO sermons (title, pastor, date, youtube, category, description) VALUES (?, ?, ?, ?, ?, ?)",
      [title, pastor, date || null, youtube || "", category || "", desc || ""]
    );
    const [rows] = await pool.query("SELECT * FROM sermons WHERE id = ?", [result.insertId]);
    res.status(201).json(toClient(rows[0]));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// PUT /api/sermons/:id — admin
router.put("/:id", requireAdmin, async (req, res) => {
  const { title, pastor, date, youtube, category, desc } = req.body || {};
  try {
    await pool.query("UPDATE sermons SET title=?, pastor=?, date=?, youtube=?, category=?, description=? WHERE id=?",
      [title, pastor, date || null, youtube || "", category || "", desc || "", req.params.id]);
    const [rows] = await pool.query("SELECT * FROM sermons WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(toClient(rows[0]));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// DELETE /api/sermons/:id — admin
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM sermons WHERE id = ?", [req.params.id]);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

export default router;
