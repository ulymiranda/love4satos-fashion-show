// Google Sheets auto-sync via Google Apps Script webhook
// No API keys needed — just a deployed Apps Script Web App URL

const https = require('https');
const http = require('http');

async function postToSheet(data) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.log('ℹ️  GOOGLE_SHEETS_WEBHOOK_URL not set — skipping Sheets sync');
    return;
  }

  return new Promise((resolve) => {
    const body = JSON.stringify(data);
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    const lib = isHttps ? https : http;

    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
      // Follow redirects (Google Apps Script redirects POST → GET)
    };

    const req = lib.request(options, (res) => {
      // Google Apps Script 302-redirects — follow it
      if (res.statusCode === 302 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location);
        const redirectOptions = {
          hostname: redirectUrl.hostname,
          path: redirectUrl.pathname + redirectUrl.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        };
        const req2 = https.request(redirectOptions, (res2) => {
          res2.on('data', () => {});
          res2.on('end', () => {
            console.log('✅ Google Sheets updated');
            resolve();
          });
        });
        req2.on('error', (e) => { console.error('Sheets redirect error:', e.message); resolve(); });
        req2.write(body);
        req2.end();
      } else {
        res.on('data', () => {});
        res.on('end', () => { console.log('✅ Google Sheets updated'); resolve(); });
      }
    });

    req.on('error', (e) => {
      console.error('Google Sheets webhook error:', e.message);
      resolve(); // Don't fail registration if Sheets is down
    });

    req.write(body);
    req.end();
  });
}

async function logDogRegistration(reg) {
  await postToSheet({
    type: 'dog',
    dog_number: reg.dog_number,
    dog_name: reg.dog_name,
    owner_name: reg.owner_name,
    email: reg.email,
    phone: reg.phone,
    dog_breed: reg.dog_breed,
    dog_age: reg.dog_age,
    costume_theme: reg.costume_theme,
    special_accommodations: reg.special_accommodations || '',
    timestamp: new Date().toISOString(),
  });
}

async function logSpectatorRegistration(spec) {
  await postToSheet({
    type: 'spectator',
    name: spec.name,
    email: spec.email,
    phone: spec.phone,
    tickets: spec.tickets,
    amount_due: spec.tickets * 10,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { logDogRegistration, logSpectatorRegistration };
