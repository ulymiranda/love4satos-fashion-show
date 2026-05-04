const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(path.join(dbDir, 'registrations.db'));

// ── Create tables ─────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dog_number INTEGER UNIQUE NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    dog_name TEXT NOT NULL,
    dog_breed TEXT NOT NULL,
    dog_age TEXT NOT NULL,
    costume_theme TEXT NOT NULL,
    special_accommodations TEXT,
    checked_in INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS spectators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    tickets INTEGER NOT NULL DEFAULT 1,
    checked_in INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ── Migration: remove legacy "categories" column if it exists ─────────────────
// SQLite doesn't support DROP COLUMN directly in older versions,
// so we recreate the table without it.
try {
  const cols = db.prepare("PRAGMA table_info(registrations)").all().map(c => c.name);
  if (cols.includes('categories')) {
    console.log('🔄 Migrating registrations table: removing legacy categories column…');
    db.exec(`
      ALTER TABLE registrations RENAME TO registrations_old;

      CREATE TABLE registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dog_number INTEGER UNIQUE NOT NULL,
        owner_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        dog_name TEXT NOT NULL,
        dog_breed TEXT NOT NULL,
        dog_age TEXT NOT NULL,
        costume_theme TEXT NOT NULL,
        special_accommodations TEXT,
        checked_in INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO registrations
        (id, dog_number, owner_name, email, phone, dog_name, dog_breed, dog_age,
         costume_theme, special_accommodations, checked_in, created_at)
      SELECT
        id, dog_number, owner_name, email, phone, dog_name, dog_breed, dog_age,
        costume_theme, special_accommodations, checked_in, created_at
      FROM registrations_old;

      DROP TABLE registrations_old;
    `);
    console.log('✅ Migration complete — all existing registrations preserved.');
  }
} catch (err) {
  console.error('Migration error (non-fatal):', err.message);
}

function getNextDogNumber() {
  const result = db.prepare('SELECT MAX(dog_number) as max_num FROM registrations').get();
  return (result.max_num || 0) + 1;
}

module.exports = { db, getNextDogNumber };
