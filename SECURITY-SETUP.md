# Echte beveiliging aanzetten (server-auth)

De code-controle verhuist naar de server; het geheim staat alleen op Vercel.
Daarna schermt Firestore de database af voor buitenstaanders.

Doe stap 1 t/m 5, en zet pas in stap 6 `SERVER_AUTH = true`. Tot dat moment
blijft de app gewoon werken met de oude (gehashte) code.

---

## 1. Service-account uit Firebase halen
1. Firebase Console → tandwiel → **Project settings** → tab **Service accounts**.
2. Klik **Generate new private key** → er wordt een JSON-bestand gedownload.
3. Open dat bestand; je hebt de **hele inhoud** zo nodig (één regel JSON).

> Dit bestand is een hoofdsleutel. Zet het NOOIT in GitHub. Alleen in Vercel (stap 3).

## 2. Firebase Authentication aanzetten
1. Firebase Console → **Build → Authentication** → **Get started**.
2. Tab **Sign-in method** → zet **Anonymous** aan (custom tokens werken hiermee).
   (Je hoeft verder niets in te stellen; we loggen in met een custom token.)

## 3. Geheimen in Vercel zetten
Vercel → je project → **Settings → Environment Variables**. Voeg toe (voor
*Production* én *Preview*):

| Naam | Waarde |
|------|--------|
| `ACCESS_CODE` | je nieuwe gezinscode, bijv. `gargano-zomer-2026` |
| `FIREBASE_SERVICE_ACCOUNT` | de **hele JSON** uit stap 1, geplakt als één waarde |

> `ANTHROPIC_API_KEY` (voor de AI-planner) laat je gewoon staan.

## 4. Code naar GitHub
Vervang/voeg toe op GitHub: `index.html`, `sw.js`, `api/auth.js`,
`package.json`, `firestore.rules`. Vercel installeert `firebase-admin`
automatisch dankzij `package.json` en deployt opnieuw.

## 5. Firestore-regels publiceren
1. Firebase Console → **Build → Firestore Database** → tab **Rules**.
2. Plak de inhoud van `firestore.rules` en klik **Publish**.

Vanaf nu weigert de database iedereen die niet via de code is ingelogd —
óók iemand met alleen de publieke Firebase-config.

## 6. Aanzetten in config.js
Open je eigen `config.js` op GitHub en:
- voeg toe: `const SERVER_AUTH = true;`
- de regel met `ACCESS_CODE` / `ACCESS_CODE_HASH` mag weg (de code leeft nu
  alleen nog op Vercel).

Sluit de app, open opnieuw → je logt nu in via de server. Rechtsboven zie je **v29**.

---

## Testen
- Juiste code → je komt binnen. Herladen → je blijft ingelogd (Firebase onthoudt de sessie).
- Verkeerde code → "Onjuiste gezinscode", je komt er niet in.
- Test de database-afscherming: open in een incognitovenster de Firestore-console-URL
  niet, maar probéér via de app zonder in te loggen iets te laden — dat hoort leeg te blijven.

## Eerlijk over de grenzen
- **Gast-modus** blijft een schermpje-restrictie: wie de code kent, kan technisch
  ook schrijven (gast = alleen de knoppen verborgen). Wil je gasten op
  database-niveau alleen-lezen? Dan is een apart "kijk-token" nodig — zeg het maar.
- Dit beschermt tegen buitenstaanders, niet tegen gezinsleden onderling.
- Eén gedeelde code voor iedereen; losse wachtwoorden per persoon is een aparte stap.
