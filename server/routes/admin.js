const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === adminPassword) {
    req.session.isAdmin = true;
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Invalid password' });
});

// Admin logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Check admin session
router.get('/session', (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

// Get all registrations
router.get('/registrations', requireAdmin, (req, res) => {
  const registrations = db.prepare('SELECT * FROM registrations ORDER BY created_at DESC').all();
  res.json(registrations);
});

// Export registrations as CSV
router.get('/registrations/export', requireAdmin, (req, res) => {
  const registrations = db.prepare('SELECT * FROM registrations ORDER BY dog_number ASC').all();

  const headers = ['Dog #', 'Dog Name', 'Owner Name', 'Email', 'Phone', 'Breed', 'Age', 'Costume Theme', 'Categories', 'Special Accommodations', 'Checked In', 'Registered At'];
  const rows = registrations.map(r => [
    r.dog_number, r.dog_name, r.owner_name, r.email, r.phone, r.dog_breed,
    r.dog_age, r.costume_theme, r.categories, r.special_accommodations || '',
    r.checked_in ? 'Yes' : 'No', r.created_at
  ].map(v => `"${String(v).replace(/"/g, '""')}"`));

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.set('Content-Type', 'text/csv');
  res.set('Content-Disposition', 'attachment; filename="love4satos-registrations.csv"');
  res.send(csv);
});

// Get category counts
router.get('/stats', requireAdmin, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM registrations').get();
  const checkedIn = db.prepare('SELECT COUNT(*) as count FROM registrations WHERE checked_in = 1').get();
  const registrations = db.prepare('SELECT categories FROM registrations').all();

  const categoryCounts = {};
  registrations.forEach(r => {
    r.categories.split(',').forEach(cat => {
      const c = cat.trim();
      if (c) categoryCounts[c] = (categoryCounts[c] || 0) + 1;
    });
  });

  const themeDistribution = db.prepare(
    'SELECT costume_theme, COUNT(*) as count FROM registrations GROUP BY costume_theme ORDER BY count DESC'
  ).all();

  res.json({ total: total.count, checkedIn: checkedIn.count, categoryCounts, themeDistribution });
});

// Check in a dog
router.patch('/registrations/:id/checkin', requireAdmin, (req, res) => {
  const { checked_in } = req.body;
  db.prepare('UPDATE registrations SET checked_in = ? WHERE id = ?').run(checked_in ? 1 : 0, req.params.id);
  res.json({ success: true });
});

// Delete a registration
router.delete('/registrations/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM registrations WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
