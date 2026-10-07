# Grace Ville API (Express + MySQL)

## 1. Database
- Start MySQL on your system (XAMPP control panel → MySQL Start, or MySQL service).
- Create the database once: `CREATE DATABASE church_db;`
- Tables + seed admin are auto-created on first API boot. Or import manually: `mysql -u root -p church_db < schema.sql`

## 2. Configure
- Copy `.env.example` → `.env` (already done) and set `DB_USER` / `DB_PASSWORD` to match your MySQL.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` seed the first admin login (only when `admins` table is empty).

## 3. Run
```
cd backend
npm install
npm run dev
```
API → http://localhost:5000, health check → http://localhost:5000/api/health

## Endpoints
- POST /api/auth/login { email, password } → { token, email }
- GET /api/auth/me (Bearer token)
- GET /api/weekly · POST/PUT/DELETE /api/weekly (admin)
- GET /api/gallery · POST/DELETE /api/gallery (admin)
- GET /api/sermons · POST/PUT/DELETE /api/sermons (admin)
- POST /api/messages · GET/DELETE /api/messages (admin)
- POST /api/newsletter/subscribe · GET/DELETE /api/newsletter (admin)
