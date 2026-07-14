# CHARIS Prayer Broadcast — Automated Telegram Prayer Broadcast

Two services that share one Postgres database:

- **`/` (Next.js)** — the admin dashboard (schedules, audio library, Telegram
  settings, live control, history, logs).
- **`/backend` (Python)** — the actual automation engine. Logs into Telegram
  as a user account (Pyrogram), joins the configured group/channel voice
  chat, and streams prayer audio into it (PyTgCalls + ffmpeg). It also polls
  the `schedules` table and triggers broadcasts automatically at the
  configured time.

The dashboard talks to the backend over HTTP (`BACKEND_URL`) for status and
manual start/stop; the backend's scheduler runs independently for automatic
daily broadcasts.

---

## 1. Local deployment (Docker Compose — recommended)

**Prerequisites:** Docker + Docker Compose, and Telegram API credentials from
https://my.telegram.org (API ID + API Hash), obtained by logging in with the
phone number of the **Telegram user account** that will join the voice chat
(this must be a real user account, not a bot — bots can't join group voice
chats with pytgcalls).

```bash
git clone <your-repo-or-unzip-here>
cd prayer-broadcast
cp .env.example .env            # dashboard env
cp backend/.env.example backend/.env   # backend env — fill in TG_API_ID / TG_API_HASH / TG_PHONE_NUMBER
```

Export the Telegram credentials for docker-compose to pick up (or put them in
a root `.env` file, which docker-compose reads automatically):

```bash
export TG_API_ID=12345678
export TG_API_HASH=your_api_hash
export TG_PHONE_NUMBER=+2348000000000
```

Start Postgres + dashboard + backend:

```bash
docker compose up -d --build
```

Run the database migrations (creates the tables from `src/db/schema.ts`):

```bash
docker compose run --rm dashboard npx drizzle-kit push \
  --config drizzle.config.json
```

(If that image doesn't have devDependencies, run it from your host instead:
`DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_db npx drizzle-kit push`.)

**First-time Telegram login** (interactive — Telegram will text/call you a
login code). Do this once:

```bash
docker compose run --rm --service-ports backend python login.py
```

Enter the OTP code (and 2FA password if you have one) when prompted. This
saves a reusable session string into the `telegram_config` table so the
backend never needs interactive login again.

Now restart the backend so it picks up the saved session:

```bash
docker compose restart backend
```

Open the dashboard: **http://localhost:3000**
- Go to **Telegram Settings** → fill in Channel ID and Voice Chat ID (or
  leave Voice Chat ID empty to auto-join the active call) → Save.
- Upload an audio file (Audio Library page — note: file upload wiring for
  the library page isn't in this build yet; simplest path is to drop the
  file into the `audio_uploads` Docker volume and insert a matching row via
  SQL, see note below).
- Go to **Live Control** → press the big button to start a broadcast right
  now, or set a **Schedule** for it to run automatically every day.

> **Audio library note:** the `/audio` page in this template is UI-only (no
> upload endpoint yet). Fastest way to get a track in for now:
> ```bash
> docker cp your-prayer-track.mp3 <backend_container_id>:/uploads/audio/track.mp3
> docker compose exec postgres psql -U postgres -d app_db -c \
>   "UPDATE audios SET file_path='/uploads/audio/track.mp3', is_default=true WHERE id=1;"
> ```
> (Building a real upload form is a good next iteration — happy to add it if
> you want.)

---

## 2. Local deployment (without Docker)

```bash
# 1. Postgres
#    Install Postgres locally, or run: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=app_db postgres:16-alpine

# 2. Dashboard
cp .env.example .env   # set DATABASE_URL, BACKEND_URL=http://localhost:8081
npm install
npx drizzle-kit push --config drizzle.config.json
npm run dev             # http://localhost:3000

# 3. Backend (separate terminal)
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
sudo apt install ffmpeg   # or brew install ffmpeg on macOS
cp .env.example .env      # fill in DATABASE_URL, TG_API_ID, TG_API_HASH, TG_PHONE_NUMBER
python login.py           # one-time interactive Telegram login
python -m app.main        # starts scheduler + control API on :8081
```

---

## 3. Cloud deployment ("making it LIVE")

The backend needs to be a **long-running process** (it holds an open
Telegram/voice-chat connection and polls a scheduler), so it doesn't fit
serverless platforms like Vercel functions. Recommended split:

| Component | Where | Why |
|---|---|---|
| Postgres | [Neon](https://neon.tech) or [Supabase](https://supabase.com) (free tier works) | Managed, reachable from both services |
| Next.js dashboard | [Vercel](https://vercel.com) | Best fit for Next.js, free tier fine |
| Python backend | A small VPS (Hetzner/DigitalOcean/Linode ~$5/mo) or [Railway](https://railway.app) / [Render](https://render.com) background worker | Needs to run continuously, keep an open connection, and have ffmpeg installed |

### Steps

1. **Database**: create a Postgres instance on Neon/Supabase, copy its
   connection string.
2. **Run migrations** once from your machine:
   ```bash
   DATABASE_URL="<neon-connection-string>" npx drizzle-kit push --config drizzle.config.json
   ```
3. **Backend** (VPS example, Ubuntu):
   ```bash
   sudo apt update && sudo apt install -y python3-venv ffmpeg
   git clone <repo> && cd prayer-broadcast/backend
   python3 -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env   # DATABASE_URL=<neon string>, TG_API_ID/HASH/PHONE
   python login.py        # one-time interactive login
   ```
   Keep it running with a process manager, e.g. `systemd`:
   ```ini
   # /etc/systemd/system/prayer-backend.service
   [Unit]
   Description=Prayer Broadcast Backend
   After=network.target

   [Service]
   WorkingDirectory=/path/to/prayer-broadcast/backend
   ExecStart=/path/to/prayer-broadcast/backend/venv/bin/python -m app.main
   Restart=always
   EnvironmentFile=/path/to/prayer-broadcast/backend/.env

   [Install]
   WantedBy=multi-user.target
   ```
   ```bash
   sudo systemctl enable --now prayer-backend
   ```
   Open port 8081 in your firewall (or put it behind Nginx/Caddy with TLS,
   recommended if the dashboard will reach it over the public internet).

4. **Dashboard on Vercel**:
   - Push this repo to GitHub, import into Vercel.
   - Set environment variables: `DATABASE_URL` (Neon string),
     `BACKEND_URL` (your VPS's public URL, e.g. `https://backend.yourdomain.com`).
   - Deploy. Vercel builds and serves the dashboard at your `*.vercel.app`
     domain (or a custom domain you attach).

5. Visit the live dashboard URL, configure Telegram settings, set your
   schedule, and you're live — the backend will auto-join the voice chat and
   stream at the scheduled time every day, and the "Live Control" page can
   trigger/stop it manually from anywhere.

---

## Notes / limitations to be aware of

- **Account risk**: automating a *user* account (not a bot) to join voice
  chats on a schedule is against Telegram's Terms of Service in spirit for
  some use cases — it's commonly done for community radio/prayer-line style
  channels, but there's a real (if generally low) risk of the account being
  flagged. Consider a dedicated Telegram account for this rather than your
  personal one.
- The audio upload UI (`/audio` page) and a couple of settings toggles
  (mute-on-join, auto-reconnect) are still front-end-only — the backend
  ignores them for now. Say the word if you'd like those wired up too.
- `pytgcalls`/`pyrogram` APIs move fast; if `pip install` pulls a newer
  major version than pinned here, check https://pytgcalls.github.io for any
  breaking API changes to `MediaStream`/`play()`.
