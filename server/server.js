require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const registrationRoutes = require('./routes/registrations');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow requests from any origin (token-based auth — no cookie dependency)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:4173',
];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return cb(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o.replace(/\/$/, '')))) return cb(null, true);
    // Also allow any vercel.app or railway.app domain for flexibility
    if (origin.endsWith('.vercel.app') || origin.endsWith('.railway.app') || origin.endsWith('.up.railway.app')) return cb(null, true);
    cb(null, true); // permissive for now — token protects admin routes
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => {
  console.log(`✅ Love 4 Satos server running on http://localhost:${PORT}`);
});
