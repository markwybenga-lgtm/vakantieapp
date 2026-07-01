// Vercel serverless functie: controleert de gezinscode op de SERVER.
// Het geheim staat in de omgevingsvariabele ACCESS_CODE op Vercel,
// dus nooit in de app of in GitHub. Bij een juiste code maakt deze functie
// een Firebase "custom token", waarmee de app inlogt bij Firebase Auth.
// Pas daarna laat Firestore (met de juiste regels) data toe.

import admin from 'firebase-admin';

function getApp() {
  if (admin.apps.length) return admin.app();
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT ontbreekt op de server');
  const cred = JSON.parse(raw);
  // In een env-variabele staat de private key vaak met letterlijke \n; herstel die.
  if (cred.private_key && cred.private_key.indexOf('\\n') > -1) {
    cred.private_key = cred.private_key.replace(/\\n/g, '\n');
  }
  return admin.initializeApp({ credential: admin.credential.cert(cred) });
}

// Vergelijking met (zo goed als) constante looptijd, tegen timing-trucs.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Alleen POST' });
    return;
  }
  const expected = process.env.ACCESS_CODE;
  if (!expected) {
    res.status(500).json({ error: 'ACCESS_CODE ontbreekt op de server' });
    return;
  }
  const code = (req.body && req.body.code) || '';
  if (!safeEqual(String(code), expected)) {
    res.status(401).json({ error: 'Onjuiste gezinscode' });
    return;
  }
  try {
    const app = getApp();
    // Eén gedeelde gezins-identiteit: iedereen die de code kent, hoort bij het gezin.
    // De app houdt zelf bij wie wie is (gekozen naam); Firebase Auth dient alleen
    // om de database af te schermen voor buitenstaanders.
    const token = await admin.auth(app).createCustomToken('reisgids-gezin', { reisgids: true });
    res.status(200).json({ token });
  } catch (e) {
    res.status(500).json({ error: 'Token maken mislukt', detail: String((e && e.message) || e) });
  }
}
