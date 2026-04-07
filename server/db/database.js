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
    categories TEXT NOT NULL,
    special_accommodations TEXT,
    checked_in INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sponsors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    tier TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed some example sponsors if empty
const sponsorCount = db.prepare('SELECT COUNT(*) as count FROM sponsors').get();
if (sponsorCount.count === 0) {
  const insertSponsor = db.prepare('INSERT INTO sponsors (name, tier, logo_url, website_url) VALUES (?, ?, ?, ?)');
  insertSponsor.run('The Baldwin School of Puerto Rico', 'platinum', null, 'https://www.baldwin.edu.pr');
  insertSponsor.run('Love 4 Satos', 'platinum', null, 'https://love4satos.org');
  insertSponsor.run('PetSmart Puerto Rico', 'gold', null, null);
  insertSponsor.run('Banco Popular de Puerto Rico', 'gold', null, null);
  insertSponsor.run('Caribbean Veterinary Group', 'silver', null, null);
  insertSponsor.run('isla Pet Foods', 'silver', null, null);
  insertSponsor.run('San Juan Star', 'bronze', null, null);
  insertSponsor.run('El Nuevo Día', 'bronze', null, null);
}

function getNextDogNumber() {
  const result = db.prepare('SELECT MAX(dog_number) as max_num FROM registrations').get();
  return (result.max_num || 0) + 1;
}

module.exports = { db, getNextDogNumber };
