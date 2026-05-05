const express = require('express');
const router = express.Router();
const { db, getNextDogNumber } = require('../db/database');
const nodemailer = require('nodemailer');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const { logDogRegistration, logSpectatorRegistration } = require('../utils/googleSheets');

// ── Get total dog registration count ─────────────────────────────────────────
router.get('/count', (req, res) => {
  const result = db.prepare('SELECT COUNT(*) as count FROM registrations').get();
  res.json({ count: result.count });
});

// ── Submit dog registration ───────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const {
    owner_name, email, phone, dog_name, dog_breed,
    dog_age, costume_theme, special_accommodations
  } = req.body;

  if (!owner_name || !email || !phone || !dog_name || !dog_breed || !dog_age || !costume_theme) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  try {
    const dogNumber = getNextDogNumber();
    const stmt = db.prepare(`
      INSERT INTO registrations
        (dog_number, owner_name, email, phone, dog_name, dog_breed, dog_age, costume_theme, special_accommodations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(dogNumber, owner_name, email, phone, dog_name, dog_breed, dog_age, costume_theme, special_accommodations || '');

    // Generate badge PDF — non-blocking so a PDF error never fails the registration
    let badgePdfBytes = null;
    try {
      badgePdfBytes = await generateBadgePDF(dogNumber, dog_name, owner_name, costume_theme);
    } catch (pdfErr) {
      console.error('Badge PDF generation failed (non-fatal):', pdfErr.message);
    }

    // Send confirmation email (non-blocking)
    sendDogConfirmationEmail(email, owner_name, dog_name, dogNumber, costume_theme, badgePdfBytes).catch(console.error);

    // Sync to Google Sheets (non-blocking)
    logDogRegistration({ dog_number: dogNumber, dog_name, owner_name, email, phone, dog_breed, dog_age, costume_theme, special_accommodations }).catch(console.error);

    res.json({
      success: true,
      dog_number: dogNumber,
      message: `Registration successful! ${dog_name} is contestant #${dogNumber}.`
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(500).json({ error: 'Registration conflict. Please try again.' });
    }
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ── Get badge PDF ─────────────────────────────────────────────────────────────
router.get('/:dogNumber/badge', async (req, res) => {
  const reg = db.prepare('SELECT * FROM registrations WHERE dog_number = ?').get(req.params.dogNumber);
  if (!reg) return res.status(404).json({ error: 'Registration not found' });

  const pdfBytes = await generateBadgePDF(reg.dog_number, reg.dog_name, reg.owner_name, reg.costume_theme);
  res.set('Content-Type', 'application/pdf');
  res.set('Content-Disposition', `attachment; filename="badge-${reg.dog_number}.pdf"`);
  res.send(Buffer.from(pdfBytes));
});

// ── Spectator registration ────────────────────────────────────────────────────
router.post('/spectators', async (req, res) => {
  const { name, email, phone, tickets } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email and phone are required.' });
  }
  const ticketCount = parseInt(tickets) || 1;
  try {
    db.prepare(
      'INSERT INTO spectators (name, email, phone, tickets) VALUES (?, ?, ?, ?)'
    ).run(name, email, phone, ticketCount);

    sendSpectatorConfirmationEmail(email, name, ticketCount).catch(console.error);

    // Sync to Google Sheets (non-blocking)
    logSpectatorRegistration({ name, email, phone, tickets: ticketCount }).catch(console.error);

    res.json({
      success: true,
      tickets: ticketCount,
      message: `You're registered! ${ticketCount} ticket${ticketCount > 1 ? 's' : ''} reserved. Pay $${ticketCount * 10} cash at the door.`
    });
  } catch (err) {
    console.error('Spectator registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PDF Badge Generator
// ─────────────────────────────────────────────────────────────────────────────
async function generateBadgePDF(dogNumber, dogName, ownerName, costumeTheme) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 300]);
  const { width, height } = page.getSize();

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Baldwin burgundy background (#7B1D32 → 0.482, 0.114, 0.196)
  const burgundy = rgb(0.482, 0.114, 0.196);
  // Dark burgundy (#5A1525 → 0.353, 0.082, 0.145)
  const darkBurgundy = rgb(0.353, 0.082, 0.145);
  // Silver (#C0C0C0 → 0.753, 0.753, 0.753)
  const silver = rgb(0.753, 0.753, 0.753);
  const white  = rgb(1, 1, 1);

  page.drawRectangle({ x: 0, y: 0, width, height, color: burgundy });

  // Silver border
  page.drawRectangle({ x: 10, y: 10, width: width - 20, height: height - 20, borderColor: silver, borderWidth: 3, color: burgundy });

  // Event title
  page.drawText('LOVE 4 SATOS',   { x: 100, y: height - 55, size: 26, font: boldFont,    color: silver });
  page.drawText('DOG FASHION SHOW', { x: 80, y: height - 78, size: 16, font: boldFont,    color: white  });

  // Dog number
  page.drawText(`#${String(dogNumber).padStart(3, '0')}`, { x: width / 2 - 35, y: height - 135, size: 48, font: boldFont, color: white });

  // Dog name
  const dogNameText = dogName.toUpperCase();
  const dogNameWidth = boldFont.widthOfTextAtSize(dogNameText, 22);
  page.drawText(dogNameText, { x: (width - dogNameWidth) / 2, y: height - 170, size: 22, font: boldFont, color: silver });

  // Owner & theme
  page.drawText(`Owner: ${ownerName}`,   { x: 30, y: height - 205, size: 12, font: regularFont, color: white });
  page.drawText(`Theme: ${costumeTheme}`, { x: 30, y: height - 222, size: 12, font: regularFont, color: white });

  // Reminder
  page.drawText('Remember: $25 cash entry fee due at check-in', { x: 30, y: height - 242, size: 9, font: regularFont, color: silver });

  // Event date
  page.drawText('May 9, 2026 | 5:30 PM | Baldwin School VPAC', { x: 30, y: height - 258, size: 10, font: regularFont, color: white });

  return await pdfDoc.save();
}

// ─────────────────────────────────────────────────────────────────────────────
// Email helpers
// ─────────────────────────────────────────────────────────────────────────────
function emailIsConfigured() {
  const user = process.env.EMAIL_USER || '';
  const pass = process.env.EMAIL_PASS || '';
  return user.length > 0 && pass.length > 0 && !pass.includes('PASTE_YOUR');
}

function createTransporter() {
  if (!emailIsConfigured()) return null;
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST  || 'smtp.gmail.com',
    port:   parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth:   { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    tls:    { rejectUnauthorized: false },
  });
}

// Export so admin route can call it for diagnostics
async function sendTestEmail(to) {
  if (!emailIsConfigured()) throw new Error('Email env vars not set — add EMAIL_USER and EMAIL_PASS in Railway Variables');
  const transporter = createTransporter();
  await transporter.verify();
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM || `Love4Satos <${process.env.EMAIL_USER}>`,
    to,
    subject: '✅ Test email — Love 4 Satos email is working!',
    html:    '<p>This is a test email confirming that email delivery is working correctly for the Love 4 Satos Dog Fashion Show registration system.</p>',
  });
}

async function sendDogConfirmationEmail(to, ownerName, dogName, dogNumber, costumeTheme, badgePdfBytes) {
  if (!emailIsConfigured()) { console.log('⚠️  Email not configured (EMAIL_PASS not set) — skipping confirmation email'); return; }
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `Love4Satos <${process.env.EMAIL_USER}>`,
    to,
    subject: `🐾 ${dogName} is contestant #${dogNumber} — Love 4 Satos Dog Fashion Show`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #7B1D32; padding: 30px; text-align: center;">
          <h1 style="color: #C0C0C0; margin: 0; font-size: 28px;">LOVE 4 SATOS</h1>
          <h2 style="color: #fff; margin: 5px 0;">Dog Fashion Show 2026</h2>
        </div>
        <div style="padding: 30px; background: #fff;">
          <p>Dear <strong>${ownerName}</strong>,</p>
          <p>🎉 <strong>${dogName}</strong> is officially registered for the Love 4 Satos Dog Fashion Show!</p>
          <div style="background: #f8f8f8; border-left: 4px solid #7B1D32; padding: 20px; margin: 20px 0;">
            <h3 style="color: #7B1D32; margin-top: 0;">Your Details</h3>
            <p><strong>Contestant Number:</strong> <span style="font-size: 24px; color: #7B1D32;">#${String(dogNumber).padStart(3, '0')}</span></p>
            <p><strong>Dog Name:</strong> ${dogName}</p>
            <p><strong>Costume Theme:</strong> ${costumeTheme}</p>
            <p><strong>Contest Categories:</strong> All categories (every dog competes in everything!)</p>
          </div>
          <div style="background: #f0f0f0; border: 1px solid #C0C0C0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <strong>💵 Payment Reminder</strong><br/>
            Please bring <strong>$25 cash</strong> on event day. Payment is collected at the check-in desk.
            No card payments accepted.
          </div>
          <div style="background: #7B1D32; color: #C0C0C0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #C0C0C0;">Event Details</h3>
            <p style="color: #fff;">📅 <strong>Date:</strong> Saturday, May 9, 2026</p>
            <p style="color: #fff;">⏰ <strong>Time:</strong> 5:30 PM – 8:00 PM (check-in from 5:00 PM)</p>
            <p style="color: #fff;">📍 <strong>Venue:</strong> The Baldwin School of Puerto Rico — VPAC Auditorium</p>
          </div>
          <p>Your numbered badge PDF is attached — please print it and bring it to check-in!</p>
          <p>See you on the red carpet! 🐾✨</p>
          <p>With love,<br><strong>The Love 4 Satos Team</strong></p>
        </div>
      </div>
    `,
    attachments: [{
      filename: `love4satos-badge-${dogNumber}.pdf`,
      content: Buffer.from(badgePdfBytes),
      contentType: 'application/pdf'
    }]
  });
}

async function sendSpectatorConfirmationEmail(to, name, tickets) {
  if (!emailIsConfigured()) { console.log('⚠️  Email not configured (EMAIL_PASS not set) — skipping confirmation email'); return; }
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `Love4Satos <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎟️ You're going! ${tickets} ticket${tickets > 1 ? 's' : ''} reserved — Love 4 Satos Dog Fashion Show`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #7B1D32; padding: 30px; text-align: center;">
          <h1 style="color: #C0C0C0; margin: 0; font-size: 28px;">LOVE 4 SATOS</h1>
          <h2 style="color: #fff; margin: 5px 0;">Dog Fashion Show 2026</h2>
        </div>
        <div style="padding: 30px; background: #fff;">
          <p>Dear <strong>${name}</strong>,</p>
          <p>🌟 Your spectator spot${tickets > 1 ? 's are' : ' is'} reserved! We can't wait to see you at the show.</p>
          <div style="background: #f8f8f8; border-left: 4px solid #7B1D32; padding: 20px; margin: 20px 0;">
            <h3 style="color: #7B1D32; margin-top: 0;">Reservation Summary</h3>
            <p><strong>Tickets Reserved:</strong> ${tickets}</p>
            <p><strong>Total to Pay at Door:</strong> $${tickets * 10} cash</p>
          </div>
          <div style="background: #f0f0f0; border: 1px solid #C0C0C0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <strong>💵 Payment Reminder</strong><br/>
            Please bring <strong>$${tickets * 10} cash</strong> on event day ($10 per person).
            Payment is collected at the entrance. No card payments accepted.
          </div>
          <div style="background: #7B1D32; color: #C0C0C0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #C0C0C0;">Event Details</h3>
            <p style="color: #fff;">📅 <strong>Date:</strong> Saturday, May 9, 2026</p>
            <p style="color: #fff;">⏰ <strong>Time:</strong> 5:30 PM – 8:00 PM</p>
            <p style="color: #fff;">📍 <strong>Venue:</strong> The Baldwin School of Puerto Rico — VPAC Auditorium, Guaynabo, PR</p>
          </div>
          <p>See you on the red carpet! 🐾✨</p>
          <p>With love,<br><strong>The Love 4 Satos Team</strong></p>
        </div>
      </div>
    `
  });
}

module.exports = router;
module.exports.sendTestEmail     = sendTestEmail;
module.exports.emailIsConfigured = emailIsConfigured;
