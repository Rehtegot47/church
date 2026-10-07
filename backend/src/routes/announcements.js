import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const toClient = (r) => ({ id: r.id, month: r.month, title: r.title, body: r.body });

// GET /api/announcements/current — this month's announcements (public)
router.get("/current", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM monthly_announcements WHERE DATE_FORMAT(month, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m') ORDER BY id ASC"
    );
    res.json(rows.map(toClient));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// GET /api/announcements/months — distinct months (admin)
router.get("/months", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT DATE_FORMAT(month, '%Y-%m') AS m FROM monthly_announcements ORDER BY m DESC");
    res.json(rows.map(r => r.m));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// GET /api/announcements?month=YYYY-MM — admin
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { month } = req.query;
    const [rows] = month
      ? await pool.query("SELECT * FROM monthly_announcements WHERE DATE_FORMAT(month, '%Y-%m') = ? ORDER BY id ASC", [month])
      : await pool.query("SELECT * FROM monthly_announcements ORDER BY month DESC, id ASC LIMIT 200");
    res.json(rows.map(toClient));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// POST /api/announcements — admin { month: YYYY-MM, title, body }
router.post("/", requireAdmin, async (req, res) => {
  const { month, title, body } = req.body || {};
  if (!month || !title) return res.status(400).json({ error: "Month and title are required" });
  try {
    const [result] = await pool.query("INSERT INTO monthly_announcements (month, title, body) VALUES (?, ?, ?)", [month + "-01", title, body || ""]);
    const [rows] = await pool.query("SELECT * FROM monthly_announcements WHERE id = ?", [result.insertId]);
    res.status(201).json(toClient(rows[0]));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// PUT /api/announcements/:id — admin
router.put("/:id", requireAdmin, async (req, res) => {
  const { title, body } = req.body || {};
  try {
    await pool.query("UPDATE monthly_announcements SET title=?, body=? WHERE id=?", [title, body || "", req.params.id]);
    const [rows] = await pool.query("SELECT * FROM monthly_announcements WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(toClient(rows[0]));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// DELETE /api/announcements/:id — admin
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM monthly_announcements WHERE id = ?", [req.params.id]);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

export default router;
