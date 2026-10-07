import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/newsletter/subscribe — public
router.post("/subscribe", async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });
  const normalized = String(email).toLowerCase().trim();
  try {
    const [existing] = await pool.query("SELECT id FROM newsletter WHERE email = ?", [normalized]);
    if (existing.length) return res.json({ subscribed: true, already: true });
    await pool.query("INSERT INTO newsletter (email) VALUES (?)", [normalized]);
    res.status(201).json({ subscribed: true });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// GET /api/newsletter — admin
router.get("/", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM newsletter ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// DELETE /api/newsletter/:id — admin
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM newsletter WHERE id = ?", [req.params.id]);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

export default router;
