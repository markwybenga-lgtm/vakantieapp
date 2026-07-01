// ======================================================================
//  INSTELLINGEN — dit bestand vul je ÉÉN keer in en raak je daarna niet meer aan.
//  Toekomstige updates van index.html kun je gerust overschrijven; dit blijft staan.
// ======================================================================
// 1) Je Firebase-config. Open je HUIDIGE index.html op GitHub, kopieer daar het
//    blok 'const firebaseConfig = { ... }' en plak het hieronder eroverheen.
const firebaseConfig = {
  apiKey: "AIzaSyDJ-4jJZY7M11xR0xyQ9eIL0iwhoDTRfLE",
  authDomain: "vakantieapp-aa5f5.firebaseapp.com",
  projectId: "vakantieapp-aa5f5",
  storageBucket: "vakantieapp-aa5f5.firebasestorage.app",
  messagingSenderId: "254418663408",
  appId: "1:254418663408:web:8b580c6a1a197ceccc4f35"
};
// 2) De namen van je gezin (verschijnen bij het stemmen).
const FAMILY = ['Mark', 'Winneke', 'Fedde', 'Jonne'];
// 3) Unieke naam voor deze reis (laat staan).
const TRIP_ID = 'italie2026';
// 4) Beveiliging via de server (zie SECURITY-SETUP.md). De toegangscode staat nu
//    als omgevingsvariabele op Vercel, niet meer hier. Zet dit pas op true zodra
//    stap 1 t/m 5 uit SECURITY-SETUP.md klaar zijn.
const SERVER_AUTH = true;
// 5) Link naar jullie gedeelde Google Foto's-album (zie README, "Foto's").
//    Leeg laten ('') tot je het album hebt gemaakt.
const GOOGLE_PHOTOS_ALBUM_URL = 'https://photos.app.goo.gl/fiEnrjBnLbZNMTKAA';
// 6) Zet op true zodra je de Claude-planner hebt opgezet (zie README, "AI-planner").
const CLAUDE_PLANNER = true;
 
