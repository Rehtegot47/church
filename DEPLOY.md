# Deploy — Netlify (site) + Render (API) + TiDB (MySQL) + Cloudinary (uploads)

All free tiers. Do it in this order.

## 1. TiDB Cloud (MySQL) — 5 min
1. Sign up at tidbcloud.com → Create Cluster → **Serverless**, region closest to you.
2. Create database `test` (default exists — use it or create `church`).
3. Database → Connect → get: **host, port (4000), user, password**.
4. Note: tables auto-create on first API boot. Seed data migrates separately (see step 4).

## 2. Cloudinary (uploads) — 3 min
1. Sign up at cloudinary.com → Dashboard → copy **Cloud name, API Key, API Secret**.

## 3. Render (backend) — 5 min
1. Sign up at render.com (with GitHub) → New → **Blueprint** → select `Rehtegot47/church`.
2. Render reads `backend/render.yaml`. Fill the `sync: false` values:
   - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (from TiDB)
   - ADMIN_PASSWORD (your admin password)
   - CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET
3. Deploy → wait for "Live" → open `https://YOUR-API.onrender.com/api/health` (expect `{"ok":true}`).

## 4. Seed production data — 2 min
On first boot the API creates tables + admin + gallery seeds automatically.
To copy your local Sunday entries over, export + import:
```
mysqldump -u root -p church_db weekly_services sermons gallery > seed.sql
mysql -h <TIDB-HOST> -P 4000 -u <USER> -p --ssl-mode=REQUIRED <DB> < seed.sql
```

## 5. Netlify (frontend) — 5 min
1. Sign up at netlify.com (with GitHub) → Add new site → Import `Rehtegot47/church`.
2. Build: `npm run build`, Publish: `dist` (already in netlify.toml).
3. Site settings → Environment variables → add:
   - `VITE_API_URL=https://YOUR-API.onrender.com`
4. Trigger deploy → site live at `https://YOUR-SITE.netlify.app`.

## 6. Keep-awake ping (free)
Render free sleeps after 15 min idle (~50s wake-up). Add a free UptimeRobot
monitor hitting `https://YOUR-API.onrender.com/api/health` every 14 minutes.

## Handover checklist for the church
- [ ] Site URL + admin URL (`/admin`)
- [ ] Admin email + password (change ADMIN_PASSWORD on Render after first login test)
- [ ] List of the 5 accounts (Netlify, Render, TiDB, Cloudinary, UptimeRobot) in the church's email
- [ ] Note: rotate JWT_SECRET + ADMIN_PASSWORD from the seed values
