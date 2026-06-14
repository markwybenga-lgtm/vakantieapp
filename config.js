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
const FAMILY = ['Mark', 'Winneke', 'Fedde', 'Jonne', 'Robert (opa)', 'Antoinette (oma)'];

// 3) Unieke naam voor deze reis (laat staan).
const TRIP_ID = 'italie2026';

// 4) Toegangscode om de app te openen. Pas aan als je een andere wilt; leeg ('') = geen slot.
const ACCESS_CODE = 'roma2026';
