// Google Sheets auto-sync via Google Apps Script webhook
// No API keys needed — just a deployed Apps Script Web App URL

const https = require('https');

async function postToSheet(data) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url || url.trim() === '') {
    console.log('ℹ️  GOOGLE_SHEETS_WEBHOOK_URL not set — skipping Sheets sync');
    return;
  }

  return new Promise((resolve) => {
    const body = JSON.stringify(data);
    const parsed = new URL(url);

    const options = {
      hostname: parsed.hostname,
      port: 443,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      // Google Apps Script 302-redirects after running the script
      // The doPost function has ALREADY executed at this point
      // We must follow the redirect with GET (not POST) to finalize
      if (res.statusCode === 302 && res.headers.location) {
        console.log('📊 Sheets: following redirect…');
        const redirectUrl = new URL(res.headers.location);
        const getReq = https.request(
          {
            hostname: redirectUrl.hostname,
            port: 443,
            path: redirectUrl.pathname + redirectUrl.search,
            method: 'GET',
          },
          (res2) => {
            res2.on('data', () => {});
            res2.on('end', () => {
              console.log('✅ Google Sheets updated');
              resolve();
            });
          }
        );
        getReq.on('error', () => {
          // Even if the GET follow fails, the script already ran
          console.log('✅ Google Sheets script ran (redirect follow minor error)');
          resolve();
        });
        getReq.end();
        return;
      }

      // Non-redirect response
      let raw = '';
      res.on('data', (c) => { raw += c; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Google Sheets updated');
        } else {
          console.error(`⚠️ Sheets returned ${res.statusCode}: ${raw.slice(0, 200)}`);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('Google Sheets webhook error:', e.message);
      resolve(); // never block a registration
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
