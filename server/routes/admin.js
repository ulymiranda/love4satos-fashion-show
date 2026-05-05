const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { requireAdmin, generateToken, invalidateToken } = require('../middleware/auth');
const { sendTestEmail, emailIsConfigured } = require('./registrations');

// ── Auth (token-based — works cross-domain) ───────────────────────────────────
router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === adminPassword) {
    const token = generateToken();
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Invalid password' });
});

router.post('/logout', (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  invalidateToken(token);
  res.json({ success: true });
});

// Validate token (used by client on page load)
router.get('/session', (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const { activeTokens } = require('../middleware/auth');
  // Re-import to check the live Set
  const auth = require('../middleware/auth');
  res.json({ isAdmin: false }); // client will use localStorage token directly
});

// ── Config status + test endpoints ───────────────────────────────────────────
router.get('/config-status', requireAdmin, (req, res) => {
  const emailOk  = emailIsConfigured();
  const sheetsOk = !!(process.env.GOOGLE_SHEETS_WEBHOOK_URL || '').trim();
  res.json({
    email: {
      configured: emailOk,
      user: emailOk ? process.env.EMAIL_USER : null,
      hint: emailOk ? null : 'Set EMAIL_USER and EMAIL_PASS (Gmail App Password) in Railway Variables',
    },
    sheets: {
      configured: sheetsOk,
      hint: sheetsOk ? null : 'Set GOOGLE_SHEETS_WEBHOOK_URL in Railway Variables',
    },
  });
});

router.post('/test-email', requireAdmin, async (req, res) => {
  const to = req.body.to || process.env.EMAIL_USER;
  try {
    await sendTestEmail(to);
    res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (err) {
    console.error('Test email failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Dog Registrations ─────────────────────────────────────────────────────────
router.get('/registrations', requireAdmin, (req, res) => {
  try {
    const registrations = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
    res.json(registrations);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

router.get('/registrations/export', requireAdmin, (req, res) => {
  const registrations = db.prepare('SELECT * FROM registrations ORDER BY dog_number ASC').all();
  const headers = ['Dog #', 'Dog Name', 'Owner Name', 'Email', 'Phone', 'Breed', 'Age', 'Costume Theme', 'Special Accommodations', 'Checked In', 'Registered At'];
  const rows = registrations.map(r => [
    r.dog_number, r.dog_name, r.owner_name, r.email, r.phone, r.dog_breed,
    r.dog_age, r.costume_theme, r.special_accommodations || '',
    r.checked_in ? 'Yes' : 'No', r.created_at
  ].map(v => `"${String(v).replace(/"/g, '""')}"`));
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.set('Content-Type', 'text/csv');
  res.set('Content-Disposition', 'attachment; filename="love4satos-dogs.csv"');
  res.send(csv);
});

router.patch('/registrations/:id/checkin', requireAdmin, (req, res) => {
  const { checked_in } = req.body;
  db.prepare('UPDATE registrations SET checked_in = ? WHERE id = ?').run(checked_in ? 1 : 0, req.params.id);
  res.json({ success: true });
});

router.delete('/registrations/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM registrations WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── Spectators ────────────────────────────────────────────────────────────────
router.get('/spectators', requireAdmin, (req, res) => {
  try {
    const spectators = db.prepare('SELECT * FROM spectators ORDER BY created_at DESC').all();
    res.json(spectators);
  } catch (err) {
    console.error('Error fetching spectators:', err);
    res.status(500).json({ error: 'Failed to fetch spectators' });
  }
});

router.get('/spectators/export', requireAdmin, (req, res) => {
  const spectators = db.prepare('SELECT * FROM spectators ORDER BY created_at ASC').all();
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Tickets', 'Amount Due', 'Checked In', 'Registered At'];
  const rows = spectators.map(s => [
    s.id, s.name, s.email, s.phone, s.tickets, `$${s.tickets * 10}`,
    s.checked_in ? 'Yes' : 'No', s.created_at
  ].map(v => `"${String(v).replace(/"/g, '""')}"`));
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.set('Content-Type', 'text/csv');
  res.set('Content-Disposition', 'attachment; filename="love4satos-spectators.csv"');
  res.send(csv);
});

router.patch('/spectators/:id/checkin', requireAdmin, (req, res) => {
  const { checked_in } = req.body;
  db.prepare('UPDATE spectators SET checked_in = ? WHERE id = ?').run(checked_in ? 1 : 0, req.params.id);
  res.json({ success: true });
});

router.delete('/spectators/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM spectators WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get('/stats', requireAdmin, (req, res) => {
  try {
    const totalDogs     = db.prepare('SELECT COUNT(*) as count FROM registrations').get();
    const checkedInDogs = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE checked_in = 1').get();
    const totalSpectators     = db.prepare('SELECT COUNT(*) as count FROM spectators').get();
    const checkedInSpectators = db.prepare('SELECT COUNT(*) as count FROM spectators WHERE checked_in = 1').get();
    const totalTickets        = db.prepare('SELECT COALESCE(SUM(tickets), 0) as sum FROM spectators').get();
    const themeDistribution   = db.prepare(
      'SELECT costume_theme, COUNT(*) as count FROM registrations GROUP BY costume_theme ORDER BY count DESC'
    ).all();
    const dogRevenue       = totalDogs.count * 25;
    const spectatorRevenue = totalTickets.sum * 10;
    res.json({
      totalDogs: totalDogs.count,
      checkedInDogs: checkedInDogs.count,
      totalSpectators: totalSpectators.count,
      checkedInSpectators: checkedInSpectators.count,
      totalTickets: totalTickets.sum,
      themeDistribution,
      dogRevenue,
      spectatorRevenue,
      totalRevenue: dogRevenue + spectatorRevenue,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

module.exports = router;
