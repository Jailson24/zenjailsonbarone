const CACHE_NAME = 'site-seguro-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/assets/gal1.jpg',
  '/assets/gal2.jpg',
  '/assets/gal3.jpg',
  '/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // handle navigation requests - use network first then fallback cache
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
    return;
  }
  // for other assets: cache-first
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).then(r => {
      // optionally put in cache
      return caches.open(CACHE_NAME).then(cache => { cache.put(event.request, r.clone()); return r; });
    })).catch(() => caches.match('/index.html'))
  );
});
