# 🚀 Free Deployment Guide — The Bullet Zone

This deploys your site for free using three services:

| Part | Service | Free tier |
|------|---------|-----------|
| Database | **MongoDB Atlas** | 512 MB |
| Backend (FastAPI) | **Render** | Free web service |
| Frontend (React) | **Cloudflare Pages** | Unlimited static hosting |

All the config files are already in this repo:
- `render.yaml` — Render backend blueprint
- `backend/requirements-prod.txt` — slim backend dependencies
- `frontend/public/_redirects` — SPA routing for Cloudflare
- `frontend/.nvmrc` — Node version for Cloudflare
- `backend/.env.example`, `frontend/.env.example` — variable reference

> ⚠️ **Important caveat about image uploads:** The Admin Dashboard's *image upload* feature uses Emergent's managed object storage, which is tied to the Emergent environment. On external hosting (Render), new uploads and previously‑uploaded images **may not work** (the storage key is environment‑bound). Everything else — login, editing all text/prices/hours, bookings, reviews, FAQ, and images provided as normal URLs — works fully. If you need uploads on the free stack, tell me and I'll switch image storage to **Cloudflare R2** (also free).

---

## Step 0 — Push this code to GitHub first
Use Emergent's **Save to GitHub** button (Profile → Connect GitHub → Save to GitHub) to create the repo `the-bullet-zone` under your account `kjhangir785-alt`. Render and Cloudflare both deploy from GitHub.

---

## Step 1 — MongoDB Atlas (database)
1. Go to https://www.mongodb.com/cloud/atlas/register and sign up (free).
2. **Create a Cluster** → choose the **M0 Free** tier → pick a region close to India (e.g. Mumbai) → Create.
3. **Database Access** → Add New Database User → username + password (save these). Role: *Read and write to any database*.
4. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`).
5. **Clusters → Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<user>` and `<password>` with the ones from step 3. Keep this handy — it's your `MONGO_URL`.

---

## Step 2 — Render (backend / FastAPI)
1. Go to https://render.com and sign up with GitHub.
2. Click **New → Blueprint**.
3. Select your `the-bullet-zone` GitHub repo. Render auto‑detects `render.yaml`.
4. Render will create a service called **the-bullet-zone-api**. Before the first deploy, open the **Environment** tab and set:
   | Key | Value |
   |-----|-------|
   | `MONGO_URL` | your Atlas connection string from Step 1 |
   | `DB_NAME` | `the_bullet_zone` |
   | `ADMIN_EMAIL` | `ayub@thebulletzone.in` |
   | `ADMIN_PASSWORD` | a strong password you choose |
   | `CORS_ORIGINS` | leave blank for now — fill in Step 4 |
   | `EMERGENT_LLM_KEY` | (optional, only for uploads — can leave blank) |
   `JWT_SECRET` is generated automatically. `PYTHON_VERSION` is already set.
5. Click **Apply / Deploy**. Wait ~3–5 min.
6. When live, copy your backend URL, e.g.:
   ```
   https://the-bullet-zone-api.onrender.com
   ```
7. Verify it works — open `https://the-bullet-zone-api.onrender.com/api/` in a browser. You should see:
   ```json
   {"message":"The Bullet Zone API is running"}
   ```
   Your owner admin account is auto‑created on first boot from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

> ℹ️ Render's free service **sleeps after 15 min of inactivity**; the first request afterward takes ~30–50s to wake up. That's normal on the free tier.

---

## Step 3 — Cloudflare Pages (frontend / React)
1. Go to https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**.
2. Select your `the-bullet-zone` repo.
3. Set the build configuration:
   | Setting | Value |
   |---------|-------|
   | **Framework preset** | Create React App |
   | **Root directory** | `frontend` |
   | **Build command** | `CI=false yarn build` |
   | **Build output directory** | `build` |
4. Under **Environment variables**, add:
   | Key | Value |
   |-----|-------|
   | `REACT_APP_BACKEND_URL` | your Render URL from Step 2 (no trailing slash) |
   | `NODE_VERSION` | `20` |
5. Click **Save and Deploy**. Wait ~2–3 min.
6. You'll get a URL like:
   ```
   https://the-bullet-zone.pages.dev
   ```

> The `CI=false` prefix prevents Cloudflare from treating harmless lint warnings as build errors.

---

## Step 4 — Connect the two (CORS)
1. Go back to **Render → the-bullet-zone-api → Environment**.
2. Set `CORS_ORIGINS` to your Cloudflare URL (exactly, no trailing slash, no spaces):
   ```
   https://the-bullet-zone.pages.dev
   ```
   If you later add a custom domain, use a comma‑separated list:
   ```
   https://the-bullet-zone.pages.dev,https://www.thebulletzone.in
   ```
3. Save — Render redeploys automatically.

---

## Step 5 — Test everything
Open your Cloudflare URL and check:
- ✅ Home, all 9 pages load, images show
- ✅ Book Service form submits (opens WhatsApp) and appears in Admin → Bookings
- ✅ Admin login at `https://the-bullet-zone.pages.dev/admin/login` with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- ✅ Edit a tagline/price → Save → refresh the public site → change shows

---

## Optional — Custom domain
- **Cloudflare Pages** → your project → *Custom domains* → add `thebulletzone.in` (free with Cloudflare DNS).
- Remember to add the new domain to `CORS_ORIGINS` on Render (Step 4).

---

## Environment variables summary
**Backend (Render):** `MONGO_URL`, `DB_NAME`, `JWT_SECRET` (auto), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CORS_ORIGINS`, `EMERGENT_LLM_KEY` (optional).
**Frontend (Cloudflare):** `REACT_APP_BACKEND_URL`, `NODE_VERSION`.

That's it — your Royal Enfield workshop site is live for free. 🏍️
