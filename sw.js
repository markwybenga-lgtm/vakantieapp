// Service worker — maakt er een installeerbare, offline-bruikbare app van.
// Versie opgehoogd naar v9 (tabbladen + onderbalk).
const CACHE = 'reisgids-v9';
const SHELL = [
  './',
  './index.html',
  './config.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Weer-API en kaarttegels nooit uit de shell-cache serveren: vers van het netwerk.
  if (url.hostname.includes('open-meteo.com') ||
      url.hostname.includes('basemaps.cartocdn.com') ||
      url.hostname.includes('tile.openstreetmap.org') ||
      url.hostname.includes('unpkg.com') ||
      url.hostname.includes('router.project-osrm.org') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('firebaseio.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 504 })));
    return;
  }
  // App-shell: eerst cache, dan netwerk.
  e.respondWith(caches.match(e.request).then((cached) => cached || fetch(e.request)));
});
