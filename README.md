# Reisgids Italië 2026 — PWA-skelet

Een installeerbare web-app (PWA) die werkt op jouw Samsung én de iPhones van je gezin.
Dit is versie 1: **reisschema + aftellen + live weer per stop**.

## Wat zit erin
- **Vandaag-kaart**: waar je nu bent, hoeveel dagen je daar nog bent en je volgende bestemming.
  (Voor de reis telt-ie af tot vertrek; erna schakelt-ie naar "welkom thuis".)
- **De route**: alle stops met datums, aantal nachten en het weer.
- **Live weer** via Open-Meteo — gratis, geen sleutel nodig. Verschijnt vanzelf zodra een
  datum binnen ±16 dagen ligt (verder vooruit kan een weermodel nog niet kijken).
- **Echte app**: via "Toevoegen aan startscherm" krijg je een eigen icoon en opent-ie offline.

## Je schema aanpassen
Open `index.html` en zoek bovenin het script naar `const TRIP = [`. Daar staat elke stop:
naam, accommodatie, `start`/`end` (JJJJ-MM-DD) en `lat`/`lng`. Pas gerust aan.

## Online zetten (de makkelijkste route)
1. Maak een gratis account op **github.com**.
2. Maak een nieuwe repository, bijv. `reisgids`.
3. Upload deze 6 bestanden (knop **Add file → Upload files**):
   `index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.
4. Ga naar **vercel.com**, log in met GitHub, klik **Add New → Project**, kies je repo en
   klik **Deploy**. Na ~20 seconden krijg je een link (bijv. `reisgids.vercel.app`).
5. Open die link op je telefoon → browsermenu → **Toevoegen aan startscherm**. Klaar.

(Alternatief zonder Vercel: in GitHub onder **Settings → Pages** je repo publiceren.)

## Stap 4 — Firebase koppelen (voor de gedeelde lijstjes)
De sectie "Samen plannen" deelt jullie ideeën en stemmen live tussen alle telefoons.
Daarvoor koppel je hem één keer aan Firebase (gratis). Duurt ~10 minuten:

1. Ga naar **console.firebase.google.com** en maak een nieuw project (Google Analytics mag je uitzetten).
2. Klik op het **`</>`-icoon** ("Web") om een web-app toe te voegen. Geef een naam, klik registreren.
   Je krijgt nu een blokje `const firebaseConfig = { ... }` te zien — **kopieer dat hele blok**.
3. Open `index.html`, zoek bovenin bij **INSTELLINGEN** naar `const firebaseConfig` en
   **vervang de PLAK-HIER-waarden** door jouw gekopieerde gegevens.
4. Zet bij `const FAMILY = [...]` de **namen van je gezin** (die verschijnen bij het stemmen).
5. In Firebase: ga naar **Build → Firestore Database → Create database**. Kies een regio
   (bijv. `europe-west`) en start in **testmodus** (of productie met de regel hieronder).
6. Upload je aangepaste `index.html` en `sw.js` opnieuw naar GitHub. Vercel zet het automatisch live.

**Eenvoudige Firestore-regel** (plak onder het tabblad *Rules* in Firestore en publiceer):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /activities/{doc} { allow read, write: if true; }
  }
}
```
Let op: deze regel laat iedereen die je adres kent meeschrijven. Voor een privé-familieapp met
een onbekend Vercel-adres is dat prima; wil je het strakker, vraag het me dan.

In de app kiest iedereen eerst bovenaan **"Wie ben jij?"**, daarna kun je per bestemming ideeën
toevoegen (of op een suggestie tikken) en met een hartje stemmen. Het idee met de meeste stemmen
komt bovenaan te staan.

## Toegangscode
De app vraagt bij openen om een code (een slot tegen pottenkijkers). Je stelt die in bovenin
`index.html` bij `const ACCESS_CODE = '...'`. Standaard staat hij op `roma2026` — **wijzig dit**
naar iets dat je gezin makkelijk onthoudt. Leeg laten (`''`) zet het slot uit.
Let op: dit houdt toevallige bezoekers buiten, maar is geen waterdichte beveiliging
(de code staat in de broncode). Wil je echte logins, vraag het me.

## Wat hierna komt (de volgende bouwstappen)
- ~~3. Kaart + "wat is er te doen" rond elke stop~~ ✓ gedaan
- ~~4. Lijstjes die je deelt, waar de kinderen op kunnen stemmen~~ ✓ gedaan
- 5. Reisafstanden + slimme dagindeling
- 6. De AI-planner: "wat kun je morgen het beste doen, gezien het weer?"
