# Wellness Within Reach — Marketing Funnel

A complete static marketing funnel with a Node.js lead capture API.

## Structure

```
funnel/
  landing-page/   ← Lead capture page (free guide opt-in)
  offer-page/     ← 14-Day Bite-Size Reconnect Challenge ($27)
  upsell-page/    ← Nervous System Reset Toolkit OTO ($37)
  lead-magnet/    ← Nervous System Rescue Guide (Markdown)
  email-sequence/ ← 5-day nurture sequence (Markdown)
api/
  server.js       ← Express server + POST /api/lead
  leads.csv       ← Captured leads (auto-created, git-ignored)
```

## Running locally with lead capture

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
node api/server.js
```

### 3. Open the funnel

```
http://localhost:3000/landing-page/
```

Leads are appended to `api/leads.csv` as `first_name,email,created_at`.

## Opening without the server

The landing page also works by opening `funnel/landing-page/index.html`
directly in a browser. When the API is unreachable, form submissions fall
back to `localStorage` automatically — no errors shown to the user.

## API

### `POST /api/lead`

**Request body (JSON):**
```json
{ "first_name": "Sarah", "email": "sarah@example.com" }
```

**Response:**
```json
{ "success": true }
```
