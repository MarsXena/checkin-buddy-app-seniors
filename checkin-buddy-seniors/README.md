# Check-In Buddy (Vercel / Next.js)

A one-URL MVP for seniors to tap **Check In** and notify their caregiver via **SMS** and/or **Email**.  
Frontend + API hosted together on **Vercel**.

## Features
- Big **Check In** button with celebratory star → gold state
- Status: ✅ checked time / ⚠️ not checked
- **Undo** button, **streak counter**, **last check-in** time
- **Settings** page (localStorage) for caregiver phone/email & channel
- **/api/checkin** serverless function: **Twilio** SMS + **SendGrid** email
- **/api/health** route for quick diagnostics

---

## Quick Start (Local)

```bash
npm install
npm run dev
# open http://localhost:3000
```

> The API will attempt to send if you set env vars in your shell. Otherwise, it runs but skips providers.

Set environment variables (optional locally):
```bash
export TWILIO_ACCOUNT_SID=ACxxxxx
export TWILIO_AUTH_TOKEN=xxxxx
export TWILIO_FROM_NUMBER=+12025550123
export SENDGRID_API_KEY=SG.xxxxx
export SENDGRID_FROM_EMAIL=you@yourdomain.com
```

---

## Deploy to Vercel (Recommended)

1. **Create a GitHub repo** and push this folder.
2. Go to **vercel.com → Add New → Project** → Import your repo.
3. Accept defaults. Vercel auto-detects Next.js.
4. In Project **Settings → Environment Variables**, add (same names):
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER` (E.164 e.g., `+12025550123`)
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`
5. Click **Deploy**. After build, open the URL Vercel gives you.
6. Visit `/settings`, enter your phone/email, pick SMS/email/both, **Save**.
7. Back on `/`, tap **Check In** → confirm you get the message(s).

**Health check**: `/api/health` should return `{ ok: true }`.

---

## Notes
- No database needed for MVP—settings are stored in **localStorage**.
- Later, add **Auth.js** (magic links) + a DB (Vercel Postgres or Supabase) to sync settings across devices.
- If you only want email or only SMS, you can omit the unused provider vars.

## License
MIT


## Updates
- Changed **Undo** to **Reset** so users can check-in multiple times per day without affecting streak.
- Added **Send Test** button on the home page for quick onboarding and troubleshooting.
- Added a simple **marketing header** with value props and a CTA.


## Public polish added
- Footer privacy note + links to **Terms** and **Privacy** pages
- **Contact form** → `/api/contact` (uses SendGrid to email site owner)
- **Generate Screenshot** button (saves current app view as PNG)
- Optional **Brand Name** and **Logo URL** in Settings (stored locally)

### Extra Environment Variable (for contact form)
- `CONTACT_TO_EMAIL` — where inbound contact messages should be sent
