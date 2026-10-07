import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/messages — public (contact form)
router.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: "Name, email and message are required" });
  try {
    const [result] = await pool.query("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)", [name, email, message]);
    res.status(201).json({ id: result.insertId, sent: true });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// GET /api/messages — admin inbox
router.get("/", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM messages ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// DELETE /api/messages/:id — admin
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM messages WHERE id = ?", [req.params.id]);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

export default router;
