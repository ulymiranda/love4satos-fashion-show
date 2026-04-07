const express = require('express');
const router = express.Router();
const { db, getNextDogNumber } = require('../db/database');
const nodemailer = require('nodemailer');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// Get total registration count
router.get('/count', (req, res) => {
  const result = db.prepare('SELECT COUNT(*) as count FROM registrations').get();
  res.json({ count: result.count });
});

// Submit registration
router.post('/', async (req, res) => {
  const {
    owner_name, email, phone, dog_name, dog_breed,
    dog_age, costume_theme, categories, special_accommodations
  } = req.body;

  if (!owner_name || !email || !phone || !dog_name || !dog_breed || !dog_age || !costume_theme || !categories) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  const categoriesStr = Array.isArray(categories) ? categories.join(',') : categories;

  try {
    const dogNumber = getNextDogNumber();
    const stmt = db.prepare(`
      INSERT INTO registrations (dog_number, owner_name, email, phone, dog_name, dog_breed, dog_age, costume_theme, categories, special_accommodations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(dogNumber, owner_name, email, phone, dog_name, dog_breed, dog_age, costume_theme, categoriesStr, special_accommodations || '');

    // Generate badge PDF
    const badgePdfBytes = await generateBadgePDF(dogNumber, dog_name, owner_name, costume_theme);

    // Send confirmation email
    sendConfirmationEmail(email, owner_name, dog_name, dogNumber, costume_theme, categoriesStr, badgePdfBytes).catch(console.error);

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

// Get badge PDF for a registration
router.get('/:dogNumber/badge', async (req, res) => {
  const reg = db.prepare('SELECT * FROM registrations WHERE dog_number = ?').get(req.params.dogNumber);
  if (!reg) return res.status(404).json({ error: 'Registration not found' });

  const pdfBytes = await generateBadgePDF(reg.dog_number, reg.dog_name, reg.owner_name, reg.costume_theme);
  res.set('Content-Type', 'application/pdf');
  res.set('Content-Disposition', `attachment; filename="badge-${reg.dog_number}.pdf"`);
  res.send(Buffer.from(pdfBytes));
});

async function generateBadgePDF(dogNumber, dogName, ownerName, costumeTheme) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 300]);
  const { width, height } = page.getSize();

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.75, 0.22, 0.17) });

  // Gold border
  page.drawRectangle({ x: 10, y: 10, width: width - 20, height: height - 20, borderColor: rgb(1, 0.84, 0), borderWidth: 3, color: rgb(0.75, 0.22, 0.17) });

  // Event title
  page.drawText('LOVE 4 SATOS', { x: 100, y: height - 55, size: 26, font: boldFont, color: rgb(1, 0.84, 0) });
  page.drawText('DOG FASHION SHOW', { x: 80, y: height - 78, size: 16, font: boldFont, color: rgb(1, 1, 1) });

  // Dog number
  page.drawText(`#${String(dogNumber).padStart(3, '0')}`, { x: width / 2 - 35, y: height - 135, size: 48, font: boldFont, color: rgb(1, 0.84, 0) });

  // Dog name
  const dogNameText = dogName.toUpperCase();
  const dogNameWidth = boldFont.widthOfTextAtSize(dogNameText, 22);
  page.drawText(dogNameText, { x: (width - dogNameWidth) / 2, y: height - 170, size: 22, font: boldFont, color: rgb(1, 1, 1) });

  // Owner
  page.drawText(`Owner: ${ownerName}`, { x: 30, y: height - 205, size: 12, font: regularFont, color: rgb(1, 1, 1) });
  page.drawText(`Theme: ${costumeTheme}`, { x: 30, y: height - 222, size: 12, font: regularFont, color: rgb(1, 1, 1) });

  // Event date
  page.drawText('May 9, 2026 | 5:30 PM | Baldwin School VPAC', { x: 30, y: height - 255, size: 10, font: regularFont, color: rgb(1, 0.84, 0) });

  return await pdfDoc.save();
}

async function sendConfirmationEmail(to, ownerName, dogName, dogNumber, costumeTheme, categories, badgePdfBytes) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured — skipping confirmation email');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const categoriesList = categories.split(',').map(c => `<li>${c.trim()}</li>`).join('');

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `Love4Satos <${process.env.EMAIL_USER}>`,
    to,
    subject: `🐾 You're registered! ${dogName} is contestant #${dogNumber} — Love 4 Satos Dog Fashion Show`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
        <div style="background: #C0392B; padding: 30px; text-align: center;">
          <h1 style="color: #FFD700; margin: 0; font-size: 28px;">LOVE 4 SATOS</h1>
          <h2 style="color: #fff; margin: 5px 0;">Dog Fashion Show 2026</h2>
        </div>
        <div style="padding: 30px;">
          <p>Dear <strong>${ownerName}</strong>,</p>
          <p>🎉 <strong>${dogName}</strong> is officially registered for the Love 4 Satos Dog Fashion Show!</p>
          <div style="background: #f8f8f8; border-left: 4px solid #C0392B; padding: 20px; margin: 20px 0;">
            <h3 style="color: #C0392B; margin-top: 0;">Your Details</h3>
            <p><strong>Dog Number:</strong> <span style="font-size: 24px; color: #C0392B;">#${String(dogNumber).padStart(3, '0')}</span></p>
            <p><strong>Dog Name:</strong> ${dogName}</p>
            <p><strong>Costume Theme:</strong> ${costumeTheme}</p>
            <p><strong>Contest Categories:</strong></p>
            <ul>${categoriesList}</ul>
          </div>
          <div style="background: #C0392B; color: #FFD700; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Event Details</h3>
            <p>📅 <strong>Date:</strong> Saturday, May 9, 2026</p>
            <p>⏰ <strong>Time:</strong> 5:30 PM – 8:00 PM</p>
            <p>📍 <strong>Venue:</strong> The Baldwin School of Puerto Rico — VPAC Auditorium</p>
          </div>
          <p>Your numbered badge PDF is attached. Please print it and bring it on the day of the event.</p>
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

module.exports = router;
