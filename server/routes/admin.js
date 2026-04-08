const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === adminPassword) {
    req.session.isAdmin = true;
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Invalid password' });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

router.get('/session', (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

// ── Dog Registrations ─────────────────────────────────────────────────────────
router.get('/registrations', requireAdmin, (req, res) => {
  const registrations = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
  res.json(registrations);
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
  const spectators = db.prepare('SELECT * FROM spectators ORDER BY created_at DESC').all();
  res.json(spectators);
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
  const totalDogs     = db.prepare('SELECT COUNT(*) as count FROM registrations').get();
  const checkedInDogs = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE checked_in = 1').get();

  const totalSpectators     = db.prepare('SELECT COUNT(*) as count FROM spectators').get();
  const checkedInSpectators = db.prepare('SELECT COUNT(*) as count FROM spectators WHERE checked_in = 1').get();
  const totalTickets        = db.prepare('SELECT COALESCE(SUM(tickets), 0) as sum FROM spectators').get();

  const themeDistribution = db.prepare(
    'SELECT costume_theme, COUNT(*) as count FROM registrations GROUP BY costume_theme ORDER BY count DESC'
  ).all();

  // Revenue projections (cash, not yet collected — just for planning)
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
});

module.exports = router;
