# Love 4 Satos Dog Fashion Show — Event Website

Full-stack event registration website for the Love 4 Satos Dog Fashion Show at The Baldwin School of Puerto Rico, May 9, 2026.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3)
- **Email**: Nodemailer
- **PDF Badges**: pdf-lib

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone / Enter the project

```bash
cd love4satos-fashion-show
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your email credentials and admin password
```

### 3. Set up the client

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Edit `server/.env`:

```env
PORT=3001
SESSION_SECRET=your_random_secret_here
ADMIN_PASSWORD=your_secure_password

# Email (Gmail example — use App Password, not regular password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Love4Satos <youremail@gmail.com>
```

> **Gmail App Passwords**: Go to Google Account → Security → 2-Step Verification → App passwords

### 5. Run in development

Open two terminals:

**Terminal 1 — Server:**
```bash
cd server
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 — Client:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### 6. Access the site

- **Website**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin
  - Default password: `admin123` (change in `.env`)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home / Landing page with countdown timer |
| `/register` | Dog registration form |
| `/event-info` | Schedule, rules, FAQ, venue map |
| `/sponsors` | Sponsor grid + become a sponsor |
| `/admin` | Password-protected admin dashboard |

## Features

- Real-time registration counter
- Auto-generated printable badge PDF (attached to confirmation email)
- Confirmation email with event details
- Admin dashboard: view all registrations, check-in on event day, export CSV
- Category statistics
- Social share buttons (Instagram, WhatsApp)
- Photo gallery placeholder section
- Embedded Google Maps
- Fully mobile responsive
- Hollywood red carpet aesthetic (deep red, black, gold)

## Production Deployment

### Build the client:
```bash
cd client
npm run build
```

Serve the `client/dist` folder as static files via Express or a CDN (Netlify, Vercel, etc.).

### Environment variables for production:
- Set `NODE_ENV=production`
- Use a strong `SESSION_SECRET`
- Change `ADMIN_PASSWORD` to something secure
- Configure real email credentials

### Recommended deployment:
- **Frontend**: Vercel or Netlify (serve `client/dist`)
- **Backend**: Railway, Render, or Fly.io
- Update the CORS origin in `server/server.js` to your frontend URL
# love4satos-fashion-show
# love4satos-fashion-show
