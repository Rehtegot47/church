import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { pool } from "./db.js";
import authRoutes from "./routes/auth.js";
import weeklyRoutes from "./routes/weekly.js";
import galleryRoutes from "./routes/gallery.js";
import sermonRoutes from "./routes/sermons.js";
import messageRoutes from "./routes/messages.js";
import newsletterRoutes from "./routes/newsletter.js";
import uploadRoutes, { uploadDir } from "./routes/uploads.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true, service: "grace-ville-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/weekly", weeklyRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/sermons", sermonRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/uploads", express.static(uploadDir));

async function migrate() {
  await pool.query(`CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS weekly_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    theme VARCHAR(255) NOT NULL,
    minister VARCHAR(255) NOT NULL,
    bible_text VARCHAR(255) DEFAULT '',
    service_time VARCHAR(50) DEFAULT '8:00 AM',
    venue TEXT,
    youtube_url VARCHAR(500) DEFAULT '',
    image_url VARCHAR(500) DEFAULT '',
    announcements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(1000) NOT NULL,
    caption VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'Service',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS sermons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    pastor VARCHAR(255) NOT NULL,
    date DATE,
    youtube VARCHAR(500) DEFAULT '',
    category VARCHAR(100) DEFAULT '',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed admin account on first run (only if admins table is empty)
  const [admins] = await pool.query("SELECT COUNT(*) AS c FROM admins");
  if (admins[0].c === 0) {
    const seedEmail = (process.env.ADMIN_EMAIL || "rccggva@gmail.com").toLowerCase().trim();
    const seedPassword = process.env.ADMIN_PASSWORD || "rccggva@gmail123";
    const hash = await bcrypt.hash(seedPassword, 10);
    await pool.query("INSERT INTO admins (email, password_hash) VALUES (?, ?)", [seedEmail, hash]);
    console.log(`Seeded admin account: ${seedEmail} (change ADMIN_PASSWORD in backend/.env afterwards)`);
  }

  // Seed gallery with church photos on first run
  const [photos] = await pool.query("SELECT COUNT(*) AS c FROM gallery");
  if (photos[0].c === 0) {
    await pool.query("INSERT INTO gallery (url, caption, category) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)", [
      "/DONATION1.jpeg", "RCCG Grace Ville Agbara Auditorium", "Service",
      "/DONATION2.jpeg", "Building Project — Grace Ville", "Service",
      "/RGVA.jpeg", "Grace Ville Identity", "Workers",
    ]);
    console.log("Seeded gallery with church photos");
  }
}

const PORT = process.env.PORT || 5000;
migrate()
  .then(() => {
    app.listen(PORT, () => console.log(`Grace Ville API running on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("Database connection failed:", e.message);
    console.error("Check backend/.env (DB_HOST/DB_USER/DB_PASSWORD/DB_NAME) and make sure MySQL is running.");
    process.exit(1);
  });
