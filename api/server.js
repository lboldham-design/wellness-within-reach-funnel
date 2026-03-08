/**
 * Wellness Within Reach — Lead Capture API
 * Run: node api/server.js
 * Serves the landing page statically and accepts POST /api/lead
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

const LEADS_FILE   = path.join(__dirname, 'leads.csv');
const LANDING_DIR  = path.join(__dirname, '..', 'funnel');

// ── Middleware ───────────────────────────────
app.use(express.json());

// Serve the entire funnel folder as static files
app.use(express.static(LANDING_DIR));

// ── Ensure leads.csv exists with a header ───
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, 'first_name,email,created_at\n', 'utf8');
}

// ── POST /api/lead ───────────────────────────
app.post('/api/lead', (req, res) => {
  const { first_name, email } = req.body;

  if (!first_name || typeof first_name !== 'string' || !first_name.trim()) {
    return res.status(400).json({ success: false, error: 'first_name is required' });
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'valid email is required' });
  }

  const row = [
    first_name.trim().replace(/,/g, ' '),
    email.trim().toLowerCase(),
    new Date().toISOString(),
  ].join(',') + '\n';

  try {
    fs.appendFileSync(LEADS_FILE, row, 'utf8');
    console.log(`Lead saved: ${first_name.trim()} <${email.trim()}>`);
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to write lead:', err);
    return res.status(500).json({ success: false, error: 'Could not save lead' });
  }
});

// ── Start ────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Wellness Within Reach server running at http://localhost:${PORT}`);
  console.log(`Landing page: http://localhost:${PORT}/landing-page/`);
  console.log(`Leads file:   ${LEADS_FILE}`);
});
