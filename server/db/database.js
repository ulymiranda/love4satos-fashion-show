const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(path.join(dbDir, 'registrations.db'));

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

function getNextDogNumber() {
  const result = db.prepare('SELECT MAX(dog_number) as max_num FROM registrations').get();
  return (result.max_num || 0) + 1;
}

module.exports = { db, getNextDogNumber };
