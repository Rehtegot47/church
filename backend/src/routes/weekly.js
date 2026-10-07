import { Router } from "express";
import { pool } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const parseAnnouncements = (v) => {
  try { const a = JSON.parse(v || "[]"); return Array.isArray(a) ? a : []; }
  catch { return []; }
};
const toClient = (r) => ({
  id: r.id,
  date: r.date,
  theme: r.theme,
  minister: r.minister,
  bibleText: r.bible_text,
  serviceTime: r.service_time,
  venue: r.venue,
  youtubeUrl: r.youtube_url,
  imageUrl: r.image_url,
  announcements: parseAnnouncements(r.announcements),
});

// GET /api/weekly — public
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM weekly_services ORDER BY date DESC");
    res.json(rows.map(toClient));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// POST /api/weekly — admin
router.post("/", requireAdmin, async (req, res) => {
  const { date, theme, minister, bibleText, serviceTime, venue, youtubeUrl, imageUrl, announcements } = req.body || {};
  if (!date || !theme || !minister) return res.status(400).json({ error: "Date, theme and minister are required" });
  try {
    const [result] = await pool.query(
      "INSERT INTO weekly_services (date, theme, minister, bible_text, service_time, venue, youtube_url, image_url, announcements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [date, theme, minister, bibleText || "", serviceTime || "8:00 AM", venue || "", youtubeUrl || "", imageUrl || "", JSON.stringify(announcements || [])]
    );
    const [rows] = await pool.query("SELECT * FROM weekly_services WHERE id = ?", [result.insertId]);
    res.status(201).json(toClient(rows[0]));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// PUT /api/weekly/:id — admin
router.put("/:id", requireAdmin, async (req, res) => {
  const { date, theme, minister, bibleText, serviceTime, venue, youtubeUrl, imageUrl, announcements } = req.body || {};
  try {
    await pool.query(
      "UPDATE weekly_services SET date=?, theme=?, minister=?, bible_text=?, service_time=?, venue=?, youtube_url=?, image_url=?, announcements=? WHERE id=?",
      [date, theme, minister, bibleText || "", serviceTime || "", venue || "", youtubeUrl || "", imageUrl || "", JSON.stringify(announcements || []), req.params.id]
    );
    const [rows] = await pool.query("SELECT * FROM weekly_services WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(toClient(rows[0]));
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

// DELETE /api/weekly/:id — admin
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM weekly_services WHERE id = ?", [req.params.id]);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: "Database error: " + e.message });
  }
});

export default router;
